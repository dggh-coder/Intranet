import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function NavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell>
      <h1 className="mb-4 text-2xl font-semibold">Navigation</h1>
      <form action="/api/navigation" method="post" className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-3 gap-3 rounded bg-white p-3 shadow-sm">
            <input name={`label_${item.id}`} defaultValue={item.label} className="rounded border p-2" />
            <input name={`href_${item.id}`} defaultValue={item.href} className="rounded border p-2" />
            <input name={`sort_${item.id}`} type="number" defaultValue={index + 1} className="rounded border p-2" />
          </div>
        ))}
        <button className="rounded bg-brand px-3 py-2 text-white">Save navigation</button>
      </form>
    </AdminShell>
  );
}
