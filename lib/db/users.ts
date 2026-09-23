import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "trading_company";

export interface BuyerRecord {
  _id: ObjectId;
  name: string;
  email: string;
  contact: string;
  photo?: string | null;
  role: "buyer";
  createdAt: Date;
  updatedAt?: Date;
}

export interface PainterRecord {
  _id: ObjectId;
  name: string;
  age: string | number;
  photograph: string;
  phone: string;
  email?: string | null;
  address: string;
  aadharNumber: string;
  description: string;
  role: "painter";
  createdAt: Date;
}

async function getBuyersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<BuyerRecord>("buyers");
}

async function getPaintersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<PainterRecord>("painters");
}

export async function getAllBuyers(limit = 200) {
  const collection = await getBuyersCollection();
  return collection
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getAllPainters(limit = 200) {
  const collection = await getPaintersCollection();
  return collection
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getBuyerCount() {
  const collection = await getBuyersCollection();
  return collection.countDocuments({});
}

export async function getPainterCount() {
  const collection = await getPaintersCollection();
  return collection.countDocuments({});
}