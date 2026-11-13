import { ViralizaHero } from "@/components/ViralizaHero";
import { ViralizaFAQ } from "@/components/ViralizaFAQ";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { getSystemSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSystemSettings();

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#070b14]">
      <ViralizaHero title={settings.siteTitle || "ViralizaReels"} />
      <ViralizaFAQ />
      <Testimonials />
      <Footer />
    </div>
  );
}
