import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const items = await prisma.navigationItem.findMany();

  await Promise.all(
    items.map((item) =>
      prisma.navigationItem.update({
        where: { id: item.id },
        data: {
          label: String(form.get(`label_${item.id}`) ?? item.label),
          href: String(form.get(`href_${item.id}`) ?? item.href),
          sortOrder: Number(form.get(`sort_${item.id}`) ?? item.sortOrder)
        }
      })
    )
  );

  return NextResponse.redirect(new URL("/admin/navigation", req.url));
}
