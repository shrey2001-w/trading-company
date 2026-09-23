import { getAllPainters } from "@/lib/db/users";
import PaintersTable, { AdminPainterRow} from "@/app/Components/admin/PaintersTable";

export default async function AdminPaintersPage() {
  const painters = await getAllPainters();

  const rows: AdminPainterRow[] = painters.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    age: p.age,
    photograph: p.photograph,
    phone: p.phone,
    email: p.email,
    address: p.address,
    aadharNumber: p.aadharNumber,
    description: p.description,
    createdAt: p.createdAt.toString(),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-[#1C1B1F]">Painters</h1>
      <PaintersTable painters={rows} />
    </div>
  );
}