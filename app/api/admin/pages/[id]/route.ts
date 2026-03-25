import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebPart } from "@/lib/webparts/registry";
import type { PageSection } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const sections = body.pageLayout as PageSection[];
  for (const section of sections) {
    for (const webPart of section.webParts) {
      const result = validateWebPart(webPart.type, webPart.config);
      if (!result.success) {
        return NextResponse.json({ error: `Invalid web part ${webPart.type}` }, { status: 400 });
      }
    }
  }

  const page = await prisma.page.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      status: body.status,
      seoTitle: body.seoTitle,
      seoDesc: body.seoDesc,
      pageLayout: sections
    }
  });

  return NextResponse.json(page);
}
