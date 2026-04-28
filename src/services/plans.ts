import { prisma } from "@/lib/prisma";

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        viewsAmount: 'asc'
      }
    });
    
    // Converte Decimal do Prisma para string/number para o frontend
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      views: plan.viewsAmount.toLocaleString('pt-BR'),
      price: plan.price.toFixed(2).replace('.', ','),
      originalPrice: plan.originalPrice?.toFixed(2).replace('.', ','),
      popular: plan.isPopular,
      badge: plan.isPopular ? "Mais Vendido" : "Econômico", // Pode ser dinâmico depois
      viewers: Math.floor(Math.random() * 40) + 10,
    }));
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return [];
  }
}
