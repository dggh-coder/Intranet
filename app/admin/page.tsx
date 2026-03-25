import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminDashboard() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <form action="/api/admin/page" method="post">
          <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Create page</button>
        </form>
      </div>
      <div className="rounded-xl bg-white shadow-sm">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between border-b px-4 py-3 last:border-none">
            <div>
              <div className="font-medium">{page.title}</div>
              <div className="text-xs text-slate-500">/{page.slug} • {page.status}</div>
            </div>
            <Link className="text-sm text-brand" href={`/admin/pages/${page.id}`}>Edit</Link>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
