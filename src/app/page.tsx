import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <TrustSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
