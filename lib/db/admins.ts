import clientPromise from "@/lib/mongodb";

export type AdminDoc = {
  _id?: string;
  username: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAdminsCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection<AdminDoc>("admins");
}