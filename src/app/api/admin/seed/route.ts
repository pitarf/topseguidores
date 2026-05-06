import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // Token de segurança simples para evitar que visitantes rodem o seed
  if (token !== "top777") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    console.log("🌱 Iniciando seed via API...");

    // 1. Configuração inicial do sistema
    await prisma.systemSetting.upsert({
      where: { id: "1" },
      update: {},
      create: {
        id: "1",
        siteTitle: "Top Seguidores - Especialista em Engajamento",
        siteDescription: "Impulsione seu Instagram e TikTok com seguidores, curtidas e visualizações reais e rápidos.",
        siteKeywords: "comprar seguidores, instagram, tiktok, curtidas, views, reels",
      },
    });

    // 2. Limpar planos antigos
    await prisma.plan.deleteMany();

    // 3. Catálogo de Planos
    const plans = [
      // INSTAGRAM - SEGUIDORES BRASILEIROS
      { name: "100 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 100, price: 11.80, originalPrice: 19.90, badge: "PACOTE BÁSICO ✅", providerServiceId: "398" },
      { name: "250 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 250, price: 29.30, originalPrice: 30.84, badge: "5% DE DESCONTO", providerServiceId: "398" },
      { name: "500 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 500, price: 44.00, originalPrice: 48.88, badge: "10% DE DESCONTO", providerServiceId: "398" },
      { name: "1000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 1000, price: 76.39, originalPrice: 99.90, badge: "MAIS VENDIDO 🎯", isPopular: true, providerServiceId: "398" },
      { name: "2500 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 2500, price: 186.10, originalPrice: 265.85, badge: "30% DE DESCONTO", providerServiceId: "398" },
      { name: "5000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 5000, price: 352.70, originalPrice: 542.61, badge: "35% DE DESCONTO", providerServiceId: "398" },
      { name: "7500 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 7500, price: 480.19, originalPrice: 800.31, badge: "40% DE DESCONTO", providerServiceId: "398" },
      { name: "10000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 10000, price: 538.90, originalPrice: 899.90, badge: "+ CUSTO / BENEFÍCIO 🏆", providerServiceId: "398" },

      // INSTAGRAM - SEGUIDORES MUNDIAIS (20% mais baratos)
      { name: "100 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 100, price: 9.44, originalPrice: 15.90, badge: "PACOTE BÁSICO ✅", providerServiceId: "123" },
      { name: "250 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 250, price: 23.44, originalPrice: 24.67, badge: "5% DE DESCONTO", providerServiceId: "123" },
      { name: "500 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 500, price: 35.20, originalPrice: 39.11, badge: "10% DE DESCONTO", providerServiceId: "123" },
      { name: "1000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 1000, price: 61.11, originalPrice: 79.90, badge: "MAIS VENDIDO 🎯", isPopular: true, providerServiceId: "123" },
      { name: "2500 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 2500, price: 148.88, originalPrice: 212.68, badge: "30% DE DESCONTO", providerServiceId: "123" },
      { name: "5000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 5000, price: 282.16, originalPrice: 434.09, badge: "35% DE DESCONTO", providerServiceId: "123" },
      { name: "7500 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 7500, price: 384.15, originalPrice: 640.25, badge: "40% DE DESCONTO", providerServiceId: "123" },
      { name: "10000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 10000, price: 431.12, originalPrice: 719.90, badge: "+ CUSTO / BENEFÍCIO 🏆", providerServiceId: "123" },

      // INSTAGRAM - CURTIDAS BRASILEIRAS
      { name: "100 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 100, price: 5.88, originalPrice: 9.90, badge: "PACOTE BÁSICO ✅", providerServiceId: "402" },
      { name: "250 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 250, price: 8.69, originalPrice: 9.14, badge: "5% DE DESCONTO", providerServiceId: "402" },
      { name: "500 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 500, price: 13.49, originalPrice: 14.98, badge: "10% DE DESCONTO", providerServiceId: "402" },
      { name: "1000 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 1000, price: 26.45, originalPrice: 34.90, badge: "MAIS VENDIDO 🎯", isPopular: true, providerServiceId: "402" },
      { name: "2500 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 2500, price: 64.90, originalPrice: 81.12, badge: "20% DE DESCONTO", providerServiceId: "402" },
      { name: "5000 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 5000, price: 74.62, originalPrice: 114.80, badge: "35% DE DESCONTO", providerServiceId: "402" },
      { name: "7500 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 7500, price: 148.90, originalPrice: 248.16, badge: "40% DE DESCONTO", providerServiceId: "402" },
      { name: "10000 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 10000, price: 164.90, originalPrice: 274.90, badge: "+ CUSTO / BENEFÍCIO 🏆", providerServiceId: "402" },

      // INSTAGRAM - CURTIDAS MUNDIAIS (20% mais baratas)
      { name: "100 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 100, price: 4.70, originalPrice: 7.90, badge: "PACOTE BÁSICO ✅", providerServiceId: "124" },
      { name: "250 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 250, price: 6.95, originalPrice: 7.31, badge: "5% DE DESCONTO", providerServiceId: "124" },
      { name: "500 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 500, price: 10.79, originalPrice: 11.98, badge: "10% DE DESCONTO", providerServiceId: "124" },
      { name: "1000 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 1000, price: 21.16, originalPrice: 27.90, badge: "MAIS VENDIDO 🎯", isPopular: true, providerServiceId: "124" },
      { name: "2500 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 2500, price: 51.92, originalPrice: 64.90, badge: "20% DE DESCONTO", providerServiceId: "124" },
      { name: "5000 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 5000, price: 59.70, originalPrice: 91.84, badge: "35% DE DESCONTO", providerServiceId: "124" },
      { name: "7500 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 7500, price: 119.12, originalPrice: 198.53, badge: "40% DE DESCONTO", providerServiceId: "124" },
      { name: "10000 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 10000, price: 131.92, originalPrice: 219.90, badge: "+ CUSTO / BENEFÍCIO 🏆", providerServiceId: "124" },

      // INSTAGRAM - VISUALIZAÇÕES REELS
      { name: "1000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 1000, price: 4.90, originalPrice: 9.00, badge: "START", providerServiceId: "379" },
      { name: "2500 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 2500, price: 9.90, originalPrice: 18.00, badge: "OFERTA", providerServiceId: "379" },
      { name: "5000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 5000, price: 14.90, originalPrice: 28.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "379" },
      { name: "10000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 10000, price: 24.90, originalPrice: 45.00, badge: "POPULAR", providerServiceId: "379" },
      { name: "50000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 50000, price: 89.90, originalPrice: 160.00, badge: "VIRAL", providerServiceId: "379" },
      { name: "100000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 100000, price: 149.90, originalPrice: 280.00, badge: "FAMOSO", providerServiceId: "379" },
      { name: "500000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 500000, price: 599.00, originalPrice: 999.00, badge: "EXPLOSÃO", providerServiceId: "379" },

      // TIKTOK
      { name: "100 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 100, price: 5.90, originalPrice: 9.00, badge: "START", providerServiceId: "855" },
      { name: "500 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 500, price: 21.90, originalPrice: 35.00, badge: "OFERTA", providerServiceId: "855" },
      { name: "1000 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 1000, price: 40.69, originalPrice: 65.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "855" },
      { name: "5000 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 5000, price: 169.90, originalPrice: 280.00, badge: "PREMIUM", providerServiceId: "855" },
      { name: "100 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 100, price: 3.90, originalPrice: 7.00, badge: "RÁPIDO", providerServiceId: "474" },
      { name: "1000 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 1000, price: 11.47, originalPrice: 22.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "474" },
      { name: "1000 Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 1000, price: 3.90, originalPrice: 8.00, badge: "START", providerServiceId: "476" },
      { name: "10000 Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 10000, price: 29.90, originalPrice: 55.00, badge: "POPULAR", isPopular: true, providerServiceId: "476" },
    ];

    for (const planData of plans) {
      await prisma.plan.create({ data: planData });
    }

    return NextResponse.json({ 
      success: true, 
      message: "✅ Seed finalizado com sucesso! Banco de dados populado.",
      plansCount: plans.length 
    });
  } catch (error) {
    console.error("Erro no Seed API:", error);
    return NextResponse.json({ error: "Erro ao processar seed" }, { status: 500 });
  }
}
