import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";
import { getSystemSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSystemSettings();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero title={settings.siteTitle} />
      <TrustSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
