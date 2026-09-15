// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderStatusBySessionId } from "@/lib/db/orders";
import { sendBrevoEmail } from "@/lib/brevo";
import {
  customerOrderConfirmationHtml,
  adminOrderNotificationHtml,
} from "@/lib/order-email-templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Stripe needs the raw request body to verify the signature, so this route
// must NOT run any JSON body parsing before this point (the App Router
// doesn't parse bodies automatically, so req.text() below is safe as-is).
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!webhookSecret || !signature) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await updateOrderStatusBySessionId(session.id, "paid");

      if (!order) {
        console.error("No matching order found for session:", session.id);
        return NextResponse.json({ received: true });
      }

      const ownerEmail = process.env.OWNER_EMAIL;

      await Promise.all([
        sendBrevoEmail({
          to: [{ email: order.customer.email, name: order.customer.name }],
          subject: `Order Confirmed — ${order.orderId}`,
          htmlContent: customerOrderConfirmationHtml(order),
        }),
        ...(ownerEmail
          ? [
              sendBrevoEmail({
                to: [{ email: ownerEmail }],
                subject: `New Stripe Order — ${order.orderId}`,
                htmlContent: adminOrderNotificationHtml(order),
              }),
            ]
          : []),
      ]);
    } catch (err) {
      console.error("Failed to finalize paid order:", err);
      // Return 500 so Stripe retries the webhook.
      return NextResponse.json({ error: "Processing failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}