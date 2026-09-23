import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateOrderStatusByOrderId, OrderStatus } from "@/lib/db/orders";

const VALID_STATUSES: OrderStatus[] = ["pending", "paid", "confirmed", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateOrderStatusByOrderId(orderId, status);
  if (!updated) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: updated });
}