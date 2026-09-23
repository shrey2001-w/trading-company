export type AdminPainterRow = {
    id: string;
    name: string;
    age: string | number;
    photograph: string;
    phone: string;
    email?: string | null;
    address: string;
    aadharNumber: string;
    description: string;
    createdAt: string;
  };
  
  export default function PaintersTable({ painters }: { painters: AdminPainterRow[] }) {
    if (painters.length === 0) {
      return <p className="text-[15px] text-[#4A4540]">No painters yet.</p>;
    }
  
    return (
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-stone-200 text-[#8a8378]">
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Aadhar</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {painters.map((painter) => (
              <tr key={painter.id} className="border-b border-stone-100 last:border-0 align-top">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={painter.photograph}
                    alt={painter.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-[#1C1B1F]">{painter.name}</td>
                <td className="px-4 py-3 text-[#4A4540]">{painter.age}</td>
                <td className="px-4 py-3 text-[#4A4540]">{painter.phone}</td>
                <td className="px-4 py-3 text-[#4A4540]">{painter.email || "—"}</td>
                <td className="px-4 py-3 text-[#4A4540] max-w-[220px]">{painter.address}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#4A4540]">{painter.aadharNumber}</td>
                <td className="px-4 py-3 text-[#4A4540]">
                  {new Date(painter.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }