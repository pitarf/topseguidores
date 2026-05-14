import { HeroWhite } from "@/components/HeroWhite";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { getSystemSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSystemSettings();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroWhite 
        title={settings.siteTitle} 
        description={settings.siteDescription}
      />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}
