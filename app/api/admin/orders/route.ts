import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllOrders, OrderStatus } from "@/lib/db/orders";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statusParam = req.nextUrl.searchParams.get("status") as OrderStatus | null;
  const orders = await getAllOrders({ status: statusParam ?? undefined });

  return NextResponse.json({ orders });
}