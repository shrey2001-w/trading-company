import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { getOrdersByCustomerEmail } from "@/lib/db/orders";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "buyer") {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const buyer = await db
      .collection("buyers")
      .findOne({ _id: new ObjectId(session.id) }, { projection: { email: 1 } });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found." }, { status: 404 });
    }

    const orders = await getOrdersByCustomerEmail(buyer.email);

    const upcoming = orders.filter((o) => o.status !== "cancelled");
    const past = orders.filter((o) => o.status === "cancelled");

    return NextResponse.json({ upcoming, past }, { status: 200 });
  } catch (err) {
    console.error("Fetch buyer orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}