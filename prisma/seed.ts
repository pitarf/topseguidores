import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de PRODUÇÃO (Instagram e TikTok)...");

  // Configuração inicial do sistema
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

  console.log("🧹 Limpando planos antigos para sincronização completa...");
  await prisma.plan.deleteMany();

  const plans = [
    // ==========================================
    // INSTAGRAM - SEGUIDORES BRASILEIROS (PREMIUM)
    // ==========================================
    { name: "100 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 100, price: 5.88, originalPrice: 7.90, badge: "START ✅", providerServiceId: "398" },
    { name: "250 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 250, price: 9.90, originalPrice: 14.90, badge: "OFERTA", providerServiceId: "398" },
    { name: "500 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 500, price: 13.49, originalPrice: 22.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "398" },
    { name: "1000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 1000, price: 26.45, originalPrice: 39.00, badge: "MELHOR CUSTO", providerServiceId: "398" },
    { name: "2500 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 2500, price: 45.90, originalPrice: 79.00, badge: "RECOMENDADO", providerServiceId: "398" },
    { name: "5000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 5000, price: 74.62, originalPrice: 129.00, badge: "SUPER DESCONTO", providerServiceId: "398" },
    { name: "10000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 10000, price: 164.90, originalPrice: 249.00, badge: "PREMIUM 🏆", providerServiceId: "398" },
    { name: "25000 Seguidores BR", platform: "instagram", type: "seguidores", packageType: "brasileiros", viewsAmount: 25000, price: 399.00, originalPrice: 599.00, badge: "INFLUENCER", providerServiceId: "398" },

    // ==========================================
    // INSTAGRAM - SEGUIDORES MUNDIAIS (STABLE)
    // ==========================================
    { name: "500 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 500, price: 14.90, originalPrice: 19.00, badge: "ECONÔMICO", providerServiceId: "123" },
    { name: "1000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 1000, price: 24.90, originalPrice: 35.00, badge: "POPULAR", providerServiceId: "123" },
    { name: "2500 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 2500, price: 54.90, originalPrice: 89.00, badge: "RECOMENDADO", providerServiceId: "123" },
    { name: "5000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 5000, price: 99.00, originalPrice: 159.00, badge: "OFERTA", providerServiceId: "123" },
    { name: "10000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 10000, price: 189.00, originalPrice: 299.00, badge: "ESCALA", providerServiceId: "123" },
    { name: "50000 Seguidores M", platform: "instagram", type: "seguidores", packageType: "mundiais", viewsAmount: 50000, price: 849.00, originalPrice: 1299.00, badge: "ESTRELA 🌟", providerServiceId: "123" },

    // ==========================================
    // INSTAGRAM - CURTIDAS BRASILEIRAS
    // ==========================================
    { name: "100 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 100, price: 5.88, originalPrice: 9.90, badge: "RÁPIDO", providerServiceId: "402" },
    { name: "250 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 250, price: 9.90, originalPrice: 16.00, badge: "OFERTA", providerServiceId: "402" },
    { name: "500 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 500, price: 14.90, originalPrice: 24.00, badge: "RECOMENDADO", providerServiceId: "402" },
    { name: "1000 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 1000, price: 26.45, originalPrice: 42.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "402" },
    { name: "5000 Curtidas BR", platform: "instagram", type: "curtidas", packageType: "brasileiros", viewsAmount: 5000, price: 89.90, originalPrice: 149.00, badge: "PACK", providerServiceId: "402" },

    // ==========================================
    // INSTAGRAM - CURTIDAS MUNDIAIS
    // ==========================================
    { name: "500 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 500, price: 9.90, originalPrice: 15.00, badge: "BARATO", providerServiceId: "124" },
    { name: "1000 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 1000, price: 17.90, originalPrice: 29.00, badge: "OFERTA", providerServiceId: "124" },
    { name: "5000 Curtidas M", platform: "instagram", type: "curtidas", packageType: "mundiais", viewsAmount: 5000, price: 69.90, originalPrice: 110.00, badge: "BOOST", providerServiceId: "124" },

    // ==========================================
    // INSTAGRAM - VISUALIZAÇÕES REELS (BR/MISTO)
    // ==========================================
    { name: "1000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 1000, price: 4.90, originalPrice: 9.00, badge: "START", providerServiceId: "379" },
    { name: "2500 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 2500, price: 9.90, originalPrice: 18.00, badge: "OFERTA", providerServiceId: "379" },
    { name: "5000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 5000, price: 14.90, originalPrice: 28.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "379" },
    { name: "10000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 10000, price: 24.90, originalPrice: 45.00, badge: "POPULAR", providerServiceId: "379" },
    { name: "50000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 50000, price: 89.90, originalPrice: 160.00, badge: "VIRAL", providerServiceId: "379" },
    { name: "100000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 100000, price: 149.90, originalPrice: 280.00, badge: "FAMOSO", providerServiceId: "379" },
    { name: "500000 Visualizações", platform: "instagram", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 500000, price: 599.00, originalPrice: 999.00, badge: "EXPLOSÃO", providerServiceId: "379" },

    // ==========================================
    // TIKTOK - SEGUIDORES
    // ==========================================
    { name: "100 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 100, price: 5.90, originalPrice: 9.00, badge: "START", providerServiceId: "855" },
    { name: "500 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 500, price: 21.90, originalPrice: 35.00, badge: "OFERTA", providerServiceId: "855" },
    { name: "1000 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 1000, price: 40.69, originalPrice: 65.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "855" },
    { name: "5000 Seguidores TK", platform: "tiktok", type: "seguidores", packageType: "brasileiros", viewsAmount: 5000, price: 169.90, originalPrice: 280.00, badge: "PREMIUM", providerServiceId: "855" },

    // ==========================================
    // TIKTOK - CURTIDAS
    // ==========================================
    { name: "100 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 100, price: 3.90, originalPrice: 7.00, badge: "RÁPIDO", providerServiceId: "474" },
    { name: "500 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 500, price: 7.90, originalPrice: 15.00, badge: "POPULAR", providerServiceId: "474" },
    { name: "1000 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 1000, price: 11.47, originalPrice: 22.00, badge: "MAIS VENDIDO", isPopular: true, providerServiceId: "474" },
    { name: "5000 Curtidas TK", platform: "tiktok", type: "curtidas", packageType: "brasileiros", viewsAmount: 5000, price: 44.90, originalPrice: 89.00, badge: "OFERTA", providerServiceId: "474" },

    // ==========================================
    // TIKTOK - VISUALIZAÇÕES
    // ==========================================
    { name: "1000 Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 1000, price: 3.90, originalPrice: 8.00, badge: "START", providerServiceId: "476" },
    { name: "10000 Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 10000, price: 29.90, originalPrice: 55.00, badge: "POPULAR", isPopular: true, providerServiceId: "476" },
    { name: "100000 Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 100000, price: 189.90, originalPrice: 320.00, badge: "VIRAL", providerServiceId: "476" },
    { name: "1M Visualizações TK", platform: "tiktok", type: "visualizacoes", packageType: "brasileiros", viewsAmount: 1000000, price: 899.00, originalPrice: 1599.00, badge: "ESTRELA 🏆", providerServiceId: "476" },
  ];

  console.log(`🚀 Sincronizando ${plans.length} planos com perfil de produção...`);
  
  for (const planData of plans) {
    await prisma.plan.create({ data: planData });
  }

  console.log("✅ Banco de dados atualizado com catálogo de produção.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
