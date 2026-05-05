import { prisma } from "@/lib/prisma";

export async function getPlans(filters?: { platform?: string, type?: string, packageType?: string }) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        ...(filters?.platform && { platform: filters.platform }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.packageType && { packageType: filters.packageType }),
      },
      orderBy: {
        viewsAmount: 'asc'
      }
    });

    console.log(`[getPlans] Encontrados ${plans.length} planos no banco com filtros:`, filters);
    
    // Converte Decimal do Prisma para string/number para o frontend
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      views: plan.viewsAmount.toLocaleString('pt-BR'),
      price: Number(plan.price).toFixed(2).replace('.', ','),
      originalPrice: plan.originalPrice ? Number(plan.originalPrice).toFixed(2).replace('.', ',') : undefined,
      popular: plan.isPopular,
      badge: plan.badge || (plan.isPopular ? "Mais Vendido" : ""),
      viewers: Math.floor(Math.random() * 40) + 10,
      // Passando metadados úteis
      platform: plan.platform,
      type: plan.type,
      packageType: plan.packageType,
      quantity: plan.viewsAmount
    }));
  } catch (error) {
    console.error("ERRO CRÍTICO AO BUSCAR PLANOS:", error);
    return [];
  }
}
