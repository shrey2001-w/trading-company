import { getSession } from "@/lib/auth";
import { getOrderStats } from "@/lib/db/orders";
import { getBuyerCount, getPainterCount } from "@/lib/db/users";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [{ totalOrders, byStatus }, buyerCount, painterCount] = await Promise.all([
    getOrderStats(),
    getBuyerCount(),
    getPainterCount(),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-[#1C1B1F]">Dashboard</h1>
      <p className="mb-6 text-[15px] text-[#4A4540]">Welcome back, {session?.name}.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Pending" value={byStatus.pending ?? 0} />
        <StatCard label="Paid" value={byStatus.paid ?? 0} />
        <StatCard label="Confirmed" value={byStatus.confirmed ?? 0} />
        <StatCard label="Cancelled" value={byStatus.cancelled ?? 0} />
        <StatCard label="Registered Painters" value={painterCount} />
        <StatCard label="Registered Buyers" value={buyerCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-sm text-[#8a8378]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#1C1B1F]">{value}</p>
    </div>
  );
}