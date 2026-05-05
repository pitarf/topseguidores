import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";
import { getPlans } from "@/services/plans";

export const dynamic = "force-dynamic";

export default async function Home() {
  const plans = await getPlans();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <TrustSection />
      <Testimonials />
      <Pricing initialPlans={plans as any} />
      <Footer />
    </div>
  );
}
