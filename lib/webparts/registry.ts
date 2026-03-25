import { webPartSchemaMap } from "@/lib/webparts/schemas";
import type { WebPartType } from "@/lib/types";

export const webPartRegistry: Record<WebPartType, { label: string; defaultConfig: unknown }> = {
  heroBanner: {
    label: "Hero banner",
    defaultConfig: {
      title: "New hero title",
      subtitle: "Supporting text",
      ctaLabel: "Learn more",
      ctaHref: "#",
      backgroundImageUrl: ""
    }
  },
  news: {
    label: "News / announcements",
    defaultConfig: {
      title: "News",
      items: [{ title: "Announcement", summary: "Details", href: "#" }]
    }
  },
  quickLinks: {
    label: "Quick links",
    defaultConfig: {
      title: "Quick links",
      links: [{ label: "Link", href: "#" }]
    }
  },
  richText: {
    label: "Rich text",
    defaultConfig: {
      html: "<p>Start writing...</p>"
    }
  },
  imageMedia: {
    label: "Image / media",
    defaultConfig: {
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      caption: ""
    }
  },
  documentList: {
    label: "Document list",
    defaultConfig: {
      title: "Documents",
      documents: [{ name: "Document", url: "#" }]
    }
  },
  embed: {
    label: "Embed block",
    defaultConfig: {
      title: "Embed",
      iframeUrl: "https://www.example.com",
      height: 320
    }
  }
};

export function validateWebPart(type: WebPartType, config: unknown) {
  return webPartSchemaMap[type].safeParse(config);
}
