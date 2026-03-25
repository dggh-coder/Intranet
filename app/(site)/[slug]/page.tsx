import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteShell } from "@/components/site/SiteShell";
import { WebPartRenderer } from "@/components/site/WebPartRenderer";
import type { PageSection } from "@/lib/types";

export default async function PublicPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.status !== "PUBLISHED") return notFound();

  const theme = await prisma.themeSettings.findFirst();
  const nav = await prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } });

  if (!theme) return notFound();

  const sections = page.pageLayout as unknown as PageSection[];

  return (
    <SiteShell
      theme={{
        siteName: theme.siteName,
        brandColor: theme.brandColor,
        headerStyle: theme.headerStyle as any,
        footerStyle: theme.footerStyle as any,
        spacingScale: theme.spacingScale as any,
        typography: theme.typography as any,
        defaultLayout: theme.defaultLayout as any
      }}
      nav={nav}
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <section
            key={section.id}
            className={`grid gap-4 ${
              section.columns === 1 ? "grid-cols-1" : section.columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
            }`}
          >
            {section.webParts.map((webPart) => (
              <WebPartRenderer key={webPart.id} webPart={webPart} />
            ))}
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
