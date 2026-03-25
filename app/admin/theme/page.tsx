import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export default async function ThemePage() {
  const theme = await prisma.themeSettings.findFirst();
  if (!theme) return null;

  return (
    <AdminShell>
      <h1 className="mb-4 text-2xl font-semibold">Theme settings</h1>
      <form action="/api/theme" method="post" className="grid max-w-2xl gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input name="siteName" defaultValue={theme.siteName} className="rounded border p-2" />
        <input name="brandColor" defaultValue={theme.brandColor} className="rounded border p-2" />
        <select name="headerStyle" defaultValue={theme.headerStyle} className="rounded border p-2"><option value="solid">solid</option><option value="elevated">elevated</option></select>
        <select name="footerStyle" defaultValue={theme.footerStyle} className="rounded border p-2"><option value="minimal">minimal</option><option value="extended">extended</option></select>
        <select name="spacingScale" defaultValue={theme.spacingScale} className="rounded border p-2"><option value="compact">compact</option><option value="comfortable">comfortable</option><option value="spacious">spacious</option></select>
        <select name="typography" defaultValue={theme.typography} className="rounded border p-2"><option value="inter">Inter</option><option value="roboto">Roboto</option><option value="lato">Lato</option></select>
        <select name="defaultLayout" defaultValue={theme.defaultLayout} className="rounded border p-2"><option value="full">full</option><option value="contained">contained</option></select>
        <button className="rounded bg-brand px-3 py-2 text-white">Save theme</button>
      </form>
    </AdminShell>
  );
}
