import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageEditor } from "@/components/admin/PageEditor";

export default async function EditPage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) return notFound();

  return (
    <AdminShell>
      <h1 className="mb-4 text-2xl font-semibold">Edit page</h1>
      <PageEditor
        initial={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          seoTitle: page.seoTitle,
          seoDesc: page.seoDesc,
          pageLayout: page.pageLayout as any
        }}
      />
    </AdminShell>
  );
}
