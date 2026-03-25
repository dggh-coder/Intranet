import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  await prisma.themeSettings.update({
    where: { id: "default-theme" },
    data: {
      siteName: String(form.get("siteName") ?? "Intranet"),
      brandColor: String(form.get("brandColor") ?? "#1d4ed8"),
      headerStyle: String(form.get("headerStyle") ?? "solid"),
      footerStyle: String(form.get("footerStyle") ?? "minimal"),
      spacingScale: String(form.get("spacingScale") ?? "comfortable"),
      typography: String(form.get("typography") ?? "inter"),
      defaultLayout: String(form.get("defaultLayout") ?? "full")
    }
  });

  return NextResponse.redirect(new URL("/admin/theme", req.url));
}
