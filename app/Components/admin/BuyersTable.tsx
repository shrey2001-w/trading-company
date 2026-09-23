export type AdminBuyerRow = {
    id: string;
    name: string;
    email: string;
    contact: string;
    photo?: string | null;
    createdAt: string;
  };
  
  export default function BuyersTable({ buyers }: { buyers: AdminBuyerRow[] }) {
    if (buyers.length === 0) {
      return <p className="text-[15px] text-[#4A4540]">No buyers yet.</p>;
    }
  
    return (
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-stone-200 text-[#8a8378]">
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3">
                  {buyer.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buyer.photo}
                      alt={buyer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-xs font-medium text-[#8a8378]">
                      {buyer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-[#1C1B1F]">{buyer.name}</td>
                <td className="px-4 py-3 text-[#4A4540]">{buyer.email}</td>
                <td className="px-4 py-3 text-[#4A4540]">{buyer.contact}</td>
                <td className="px-4 py-3 text-[#4A4540]">
                  {new Date(buyer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }