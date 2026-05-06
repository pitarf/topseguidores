import { getSystemSettings } from "@/services/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSystemSettings();

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
