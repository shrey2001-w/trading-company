// lib/db/orders.ts
import clientPromise from "@/lib/mongodb";
import { OrderDetails } from "@/lib/order-email-templates";

export type OrderStatus = "pending" | "paid" | "confirmed" | "cancelled";

export interface OrderRecord extends OrderDetails {
  status: OrderStatus;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DB_NAME = process.env.MONGODB_DB || "trading_company";
const COLLECTION = "orders";

async function getOrdersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<OrderRecord>(COLLECTION);
}

export async function createOrder(
  order: Omit<OrderRecord, "createdAt" | "updatedAt">
) {
  const collection = await getOrdersCollection();
  const now = new Date();
  const record: OrderRecord = { ...order, createdAt: now, updatedAt: now };
  await collection.insertOne(record);
  return record;
}

export async function updateOrderStatusBySessionId(
  stripeSessionId: string,
  status: OrderStatus
) {
  const collection = await getOrdersCollection();
  const result = await collection.findOneAndUpdate(
    { stripeSessionId },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result;
}

export async function getOrderById(orderId: string) {
  const collection = await getOrdersCollection();
  return collection.findOne({ orderId });
}