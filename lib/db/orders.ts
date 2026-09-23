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

export async function getOrdersByCustomerEmail(email: string) {
  const collection = await getOrdersCollection();
  return collection
    .find({ "customer.email": email })
    .sort({ createdAt: -1 })
    .toArray();
}

// ---- Admin additions ----

export async function getAllOrders(
  opts: { status?: OrderStatus; limit?: number } = {}
) {
  const collection = await getOrdersCollection();
  const filter = opts.status ? { status: opts.status } : {};
  return collection
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(opts.limit ?? 100)
    .toArray();
}

export async function updateOrderStatusByOrderId(
  orderId: string,
  status: OrderStatus
) {
  const collection = await getOrdersCollection();
  const result = await collection.findOneAndUpdate(
    { orderId },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result;
}

export async function getOrderStats() {
  const collection = await getOrdersCollection();

  const [totalOrders, statusAgg] = await Promise.all([
    collection.countDocuments({}),
    collection
      .aggregate<{ _id: OrderStatus; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const byStatus: Record<string, number> = {
    pending: 0,
    paid: 0,
    confirmed: 0,
    cancelled: 0,
  };
  for (const s of statusAgg) {
    byStatus[s._id] = s.count;
  }

  return { totalOrders, byStatus };
}