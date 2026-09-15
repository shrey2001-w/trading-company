// app/api/checkout/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/lib/db/orders";
import { OrderCustomer, OrderItem } from "@/lib/order-email-templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface StripeCheckoutItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      items,
      subtotal,
      shipping,
      grandTotal,
      customer,
    }: {
      items: (StripeCheckoutItem & { total: number })[];
      subtotal: number;
      shipping: number;
      grandTotal: number;
      customer: OrderCustomer;
    } = body;

    if (!Array.isArray(items) || items.length === 0 || !customer?.email) {
      return NextResponse.json(
        { error: "Invalid checkout payload." },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      }));

    if (shipping > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const orderId = `ORD-${Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { orderId, customerName: customer.name },
    });

    // Save the order as "pending". A Stripe webhook (checkout.session.completed)
    // flips this to "paid" and sends the confirmation emails once payment is
    // actually confirmed — never trust the client-side redirect alone for that.
    const orderItems: OrderItem[] = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    }));

    await createOrder({
      orderId,
      customer,
      items: orderItems,
      subtotal,
      shipping,
      grandTotal,
      paymentMethod: "stripe",
      status: "pending",
      stripeSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}