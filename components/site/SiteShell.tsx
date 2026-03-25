import Link from "next/link";
import type { ThemeModel } from "@/lib/types";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function SiteShell({
  theme,
  nav,
  children
}: {
  theme: ThemeModel;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const containerClass = theme.defaultLayout === "contained" ? "mx-auto max-w-6xl px-6" : "px-6";

  return (
    <div style={{ ["--brand-color" as string]: theme.brandColor }} className="min-h-screen">
      <header className={`border-b bg-white ${theme.headerStyle === "elevated" ? "shadow-sm" : ""}`}>
        <div className={`${containerClass} flex h-16 items-center justify-between`}>
          <h1 className="font-semibold text-brand">{theme.siteName}</h1>
          <nav className="flex gap-4 text-sm">
            {nav.map((item) => (
              <Link key={item.id} href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className={containerClass + " py-8"}>{children}</main>
      <footer className="mt-10 border-t bg-white">
        <div className={containerClass + " py-8 text-sm text-slate-500"}>
          {theme.footerStyle === "extended" ? "© 2026 Contoso. Internal use only." : "Internal use only"}
        </div>
      </footer>
    </div>
  );
}
