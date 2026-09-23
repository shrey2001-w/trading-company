"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus = "pending" | "paid" | "confirmed" | "cancelled";

export type AdminOrderRow = {
  orderId: string;
  status: OrderStatus;
  paymentMethod: "cash" | "stripe";
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  grandTotal: number;
  currencySymbol?: string;
  createdAt: string;
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "paid", "confirmed", "cancelled"];

export default function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update status.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong updating the order.");
    } finally {
      setUpdating(null);
    }
  }

  if (orders.length === 0) {
    return <p className="text-[15px] text-[#4A4540]">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      {error && <p className="border-b border-stone-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-stone-200 text-[#8a8378]">
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b border-stone-100 last:border-0 align-top">
              <td className="px-4 py-3 font-mono text-xs text-[#1C1B1F]">{order.orderId}</td>
              <td className="px-4 py-3 text-[#1C1B1F]">
                <div className="font-medium">{order.customer.name}</div>
                <div className="text-xs text-[#8a8378]">{order.customer.email}</div>
                <div className="text-xs text-[#8a8378]">{order.customer.phone}</div>
                <div className="mt-1 text-xs text-[#4A4540]">
                  {order.customer.address}, {order.customer.city}, {order.customer.state}{" "}
                  {order.customer.pincode}
                </div>
              </td>
              <td className="px-4 py-3 text-[#1C1B1F] capitalize">{order.paymentMethod}</td>
              <td className="px-4 py-3 font-medium text-[#1C1B1F]">
                {order.currencySymbol || "₹"}
                {order.grandTotal.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-[#4A4540]">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  disabled={updating === order.orderId}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                  className="rounded-md border border-stone-300 px-2 py-1 text-[13px] focus:border-[#2F4B8C] focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}