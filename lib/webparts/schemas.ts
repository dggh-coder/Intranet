import { z } from "zod";

export const heroBannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().default(""),
  ctaLabel: z.string().optional().default(""),
  ctaHref: z.string().optional().default("#"),
  backgroundImageUrl: z.string().url().optional().or(z.literal(""))
});

export const newsSchema = z.object({
  title: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      href: z.string().min(1)
    })
  )
});

export const quickLinksSchema = z.object({
  title: z.string().min(1),
  links: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1)
    })
  )
});

export const richTextSchema = z.object({
  html: z.string().min(1)
});

export const imageMediaSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional().default("")
});

export const documentListSchema = z.object({
  title: z.string().min(1),
  documents: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().min(1)
    })
  )
});

export const embedSchema = z.object({
  title: z.string().optional().default(""),
  iframeUrl: z.string().url(),
  height: z.number().min(120).max(1000).default(320)
});

export const webPartSchemaMap = {
  heroBanner: heroBannerSchema,
  news: newsSchema,
  quickLinks: quickLinksSchema,
  richText: richTextSchema,
  imageMedia: imageMediaSchema,
  documentList: documentListSchema,
  embed: embedSchema
} as const;

export type WebPartSchemaMap = typeof webPartSchemaMap;
