import { prisma } from "@/lib/prisma";
import { ServicesList } from "./ServicesList";

export const dynamic = "force-dynamic";

export default async function ServicosAdminPage() {
  const plans = await prisma.plan.findMany({
    orderBy: [
      { platform: 'asc' },
      { type: 'asc' },
      { viewsAmount: 'asc' }
    ]
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Gestão de Serviços</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Configure preços, quantidades e IDs do fornecedor</p>
        </div>
      </header>

      <ServicesList initialPlans={JSON.parse(JSON.stringify(plans))} />
    </div>
  );
}
