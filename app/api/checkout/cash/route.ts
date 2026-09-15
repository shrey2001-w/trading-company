// app/api/checkout/cash/route.ts
import { NextResponse } from "next/server";
import { sendBrevoEmail } from "@/lib/brevo";
import {
  customerOrderConfirmationHtml,
  adminOrderNotificationHtml,
  OrderDetails,
} from "@/lib/order-email-templates";
import { createOrder } from "@/lib/db/orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ownerEmail = process.env.OWNER_EMAIL;
    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OWNER_EMAIL." },
        { status: 500 }
      );
    }

    if (!body?.customer?.email || !Array.isArray(body?.items)) {
      return NextResponse.json(
        { error: "Invalid order payload." },
        { status: 400 }
      );
    }

    const order: OrderDetails = {
      orderId: `ORD-${Date.now()}`,
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      grandTotal: body.grandTotal,
      paymentMethod: "cash",
    };

    // Cash orders are confirmed immediately (no online payment to wait on).
    await createOrder({ ...order, status: "confirmed" });

    await Promise.all([
      sendBrevoEmail({
        to: [{ email: order.customer.email, name: order.customer.name }],
        subject: `Order Confirmed — ${order.orderId}`,
        htmlContent: customerOrderConfirmationHtml(order),
      }),
      sendBrevoEmail({
        to: [{ email: ownerEmail }],
        subject: `New Cash Order — ${order.orderId}`,
        htmlContent: adminOrderNotificationHtml(order),
      }),
    ]);

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (err) {
    console.error("Cash order email error:", err);
    return NextResponse.json(
      { error: "Failed to process cash order." },
      { status: 500 }
    );
  }
}