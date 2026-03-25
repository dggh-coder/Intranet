import { validateWebPart } from "@/lib/webparts/registry";
import type { WebPartDefinition } from "@/lib/types";

export function WebPartRenderer({ webPart }: { webPart: WebPartDefinition }) {
  const validation = validateWebPart(webPart.type, webPart.config);
  if (!validation.success) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-sm">Invalid web part config</div>;
  }

  const config = validation.data as any;

  switch (webPart.type) {
    case "heroBanner":
      return (
        <section className="rounded-xl bg-slate-900 p-10 text-white" style={{ backgroundImage: config.backgroundImageUrl ? `linear-gradient(rgba(15,23,42,0.7),rgba(15,23,42,0.7)),url(${config.backgroundImageUrl})` : undefined, backgroundSize: "cover" }}>
          <h2 className="text-3xl font-bold">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-slate-100">{config.subtitle}</p>
          {config.ctaLabel ? <a href={config.ctaHref} className="mt-6 inline-block rounded bg-brand px-4 py-2 text-sm">{config.ctaLabel}</a> : null}
        </section>
      );
    case "news":
      return (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">{config.title}</h3>
          <ul className="space-y-3">
            {config.items.map((item: any) => (
              <li key={item.title}>
                <a href={item.href} className="font-medium hover:text-brand">{item.title}</a>
                <p className="text-sm text-slate-600">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      );
    case "quickLinks":
      return (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">{config.title}</h3>
          <ul className="space-y-2">
            {config.links.map((link: any) => (
              <li key={link.label}>
                <a href={link.href} className="text-brand underline-offset-4 hover:underline">{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      );
    case "richText":
      return <section className="prose max-w-none rounded-xl bg-white p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: config.html }} />;
    case "imageMedia":
      return (
        <figure className="rounded-xl bg-white p-3 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={config.imageUrl} alt={config.caption || "Image block"} className="w-full rounded-lg object-cover" />
          {config.caption ? <figcaption className="mt-2 text-sm text-slate-600">{config.caption}</figcaption> : null}
        </figure>
      );
    case "documentList":
      return (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">{config.title}</h3>
          <ul className="space-y-2 text-sm">
            {config.documents.map((doc: any) => (
              <li key={doc.name}><a href={doc.url} className="hover:text-brand">📄 {doc.name}</a></li>
            ))}
          </ul>
        </section>
      );
    case "embed":
      return (
        <section className="rounded-xl bg-white p-4 shadow-sm">
          {config.title ? <h3 className="mb-3 text-lg font-semibold">{config.title}</h3> : null}
          <iframe src={config.iframeUrl} title={config.title || "Embed"} className="w-full rounded" style={{ height: config.height }} />
        </section>
      );
    default:
      return null;
  }
}
