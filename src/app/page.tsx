import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Features } from "@/components/Features";
import { getPlans } from "@/services/plans";

export default async function Home() {
  const plans = await getPlans();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <Pricing initialPlans={plans} />
      <Features />
      {/* Footer Simples */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm">
            © 2026 Cresce Reels. Todos os direitos reservados.
          </p>
          <p className="mt-2 text-zinc-600 text-xs">
            Não somos afiliados ao Instagram ou Meta.
          </p>
        </div>
      </footer>
    </div>
  );
}
