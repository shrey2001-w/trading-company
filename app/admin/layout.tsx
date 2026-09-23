import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/sign-in/admin");
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      <aside className="hidden w-56 shrink-0 border-r border-stone-200 bg-white p-4 md:block">
        <p className="mb-6 text-lg font-semibold text-[#1C1B1F]">Admin</p>
        <nav className="flex flex-col gap-1">
          <Link href="/admin" className="rounded-md px-3 py-2 text-[15px] font-medium text-[#4A4540] hover:bg-stone-100">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="rounded-md px-3 py-2 text-[15px] font-medium text-[#4A4540] hover:bg-stone-100">
            Orders
          </Link>
          <Link href="/admin/painters" className="rounded-md px-3 py-2 text-[15px] font-medium text-[#4A4540] hover:bg-stone-100">
            Painters
          </Link>
          <Link href="/admin/buyers" className="rounded-md px-3 py-2 text-[15px] font-medium text-[#4A4540] hover:bg-stone-100">
            Buyers
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}