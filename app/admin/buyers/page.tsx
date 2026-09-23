import { getAllBuyers } from "@/lib/db/users";
import BuyersTable , {AdminBuyerRow} from "@/app/Components/admin/BuyersTable";

export default async function AdminBuyersPage() {
  const buyers = await getAllBuyers();

  const rows: AdminBuyerRow[] = buyers.map((b) => ({
    id: b._id.toString(),
    name: b.name,
    email: b.email,
    contact: b.contact,
    photo: b.photo,
    createdAt: b.createdAt.toString(),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Buyers</h1>
      <BuyersTable buyers={rows} />
    </div>
  );
}