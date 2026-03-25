import { PrismaClient, PageStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@intranet.local" },
    update: {},
    create: {
      email: "admin@intranet.local",
      name: "Intranet Admin",
      passwordHash
    }
  });

  await prisma.themeSettings.upsert({
    where: { id: "default-theme" },
    update: {},
    create: {
      id: "default-theme",
      siteName: "Contoso Intranet",
      brandColor: "#1d4ed8",
      headerStyle: "solid",
      footerStyle: "minimal",
      spacingScale: "comfortable",
      typography: "inter",
      defaultLayout: "full"
    }
  });

  await prisma.navigationItem.deleteMany();
  await prisma.navigationItem.createMany({
    data: [
      { label: "Home", href: "/", sortOrder: 1 },
      { label: "News", href: "/news", sortOrder: 2 },
      { label: "Documents", href: "/docs", sortOrder: 3 }
    ]
  });

  const homepageLayout = [
    {
      id: "section-hero",
      columns: 1,
      webParts: [
        {
          id: "wp-hero",
          type: "heroBanner",
          config: {
            title: "Welcome to Contoso Intranet",
            subtitle: "Your internal hub for news, tools, and documents.",
            ctaLabel: "Read announcements",
            ctaHref: "/news",
            backgroundImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c"
          }
        }
      ]
    },
    {
      id: "section-main",
      columns: 2,
      webParts: [
        {
          id: "wp-news",
          type: "news",
          config: {
            title: "Latest announcements",
            items: [
              { title: "Quarterly all-hands on Friday", summary: "Join leadership for updates.", href: "#" },
              { title: "Benefits enrollment opens", summary: "Review your plan options by April 15.", href: "#" }
            ]
          }
        },
        {
          id: "wp-links",
          type: "quickLinks",
          config: {
            title: "Quick links",
            links: [
              { label: "HR portal", href: "#" },
              { label: "Expense submission", href: "#" },
              { label: "IT support", href: "#" }
            ]
          }
        }
      ]
    },
    {
      id: "section-docs",
      columns: 3,
      webParts: [
        {
          id: "wp-docs",
          type: "documentList",
          config: {
            title: "Popular documents",
            documents: [
              { name: "Employee handbook", url: "#" },
              { name: "Brand guidelines", url: "#" },
              { name: "Procurement policy", url: "#" }
            ]
          }
        },
        {
          id: "wp-rich",
          type: "richText",
          config: {
            html: "<h3>Office updates</h3><p>HQ floor 2 renovation starts next week.</p>"
          }
        },
        {
          id: "wp-media",
          type: "imageMedia",
          config: {
            imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094",
            caption: "Collaboration spaces now open"
          }
        }
      ]
    }
  ];

  await prisma.page.upsert({
    where: { slug: "home" },
    update: {
      title: "Home",
      status: PageStatus.PUBLISHED,
      pageLayout: homepageLayout
    },
    create: {
      title: "Home",
      slug: "home",
      status: PageStatus.PUBLISHED,
      seoTitle: "Contoso Intranet Home",
      seoDesc: "Company news, links, and resources",
      pageLayout: homepageLayout
    }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
