import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const created = await prisma.page.create({
    data: {
      title: "Untitled Page",
      slug: `page-${Math.floor(Math.random() * 10000)}`,
      status: "DRAFT",
      pageLayout: []
    }
  });

  return NextResponse.redirect(new URL(`/admin/pages/${created.id}`, req.url));
}
