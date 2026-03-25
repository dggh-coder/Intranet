import { describe, it, expect } from "vitest";
import { validateWebPart } from "@/lib/webparts/registry";

describe("web part schema validation", () => {
  it("accepts valid hero config", () => {
    const result = validateWebPart("heroBanner", {
      title: "Welcome",
      subtitle: "Hello",
      ctaLabel: "Open",
      ctaHref: "/home",
      backgroundImageUrl: "https://example.com/a.jpg"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid document list", () => {
    const result = validateWebPart("documentList", {
      title: "Docs",
      documents: [{ name: "Doc" }]
    });

    expect(result.success).toBe(false);
  });
});
