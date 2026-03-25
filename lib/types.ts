export type LayoutColumns = 1 | 2 | 3;

export type WebPartType =
  | "heroBanner"
  | "news"
  | "quickLinks"
  | "richText"
  | "imageMedia"
  | "documentList"
  | "embed";

export interface WebPartDefinition {
  id: string;
  type: WebPartType;
  config: unknown;
}

export interface PageSection {
  id: string;
  columns: LayoutColumns;
  webParts: WebPartDefinition[];
}

export interface PageLayout {
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle?: string | null;
  seoDesc?: string | null;
  pageLayout: PageSection[];
}

export interface ThemeModel {
  siteName: string;
  brandColor: string;
  headerStyle: "solid" | "elevated";
  footerStyle: "minimal" | "extended";
  spacingScale: "compact" | "comfortable" | "spacious";
  typography: "inter" | "roboto" | "lato";
  defaultLayout: "full" | "contained";
}
