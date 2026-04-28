import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.systemSetting.findFirst() || {
    siteTitle: "Cresce Reels - Comprar Visualizações Instagram",
    siteDescription: "Aumente seu engajamento no Reels de forma rápida e segura.",
    siteKeywords: "comprar visualizações, instagram reels, engajamento, redes sociais",
    faviconUrl: "",
    logoUrl: "",
    fbPixelId: "",
    fbApiToken: ""
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">SEO, Meta & Tracking</h1>
        <p className="text-zinc-400 font-medium text-sm mt-1">Configure o Branding do site e gerencie a inteligência do Facebook Ads (Pixel/CAPI).</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
