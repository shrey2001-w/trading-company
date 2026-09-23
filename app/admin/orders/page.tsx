import { getAllOrders } from "@/lib/db/orders";
import OrdersTable , { AdminOrderRow} from "@/app/Components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders({ limit: 200 });

  const rows: AdminOrderRow[] = orders.map((o) => ({
    orderId: o.orderId,
    status: o.status,
    paymentMethod: o.paymentMethod,
    customer: o.customer,
    grandTotal: o.grandTotal,
    currencySymbol: o.currencySymbol,
    createdAt: o.createdAt.toString(),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Orders</h1>
      <OrdersTable orders={rows} />
    </div>
  );
}