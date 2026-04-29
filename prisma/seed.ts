import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  console.log("Iniciando seed...");

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // 1. Configurações Iniciais
  await prisma.systemSetting.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      siteTitle: "Viraliza Reels - Comprar Visualizações Instagram",
      siteDescription: "Aumente seu engajamento no Reels de forma rápida e segura. Entrega em até 10 minutos!",
      siteKeywords: "comprar visualizações, instagram reels, viralizar, engajamento social",
    },
  });

  // 2. Planos Padrão (Limpar antes para evitar duplicidade no seed)
  await prisma.plan.deleteMany();

  const plansList = [
    { name: "Pacote Teste", viewsAmount: 1000, price: 3.00, originalPrice: 5.00, isPopular: true, badge: "💎 TESTE" },
    { name: "STARTER", viewsAmount: 5000, price: 5.00, originalPrice: 9.00, isPopular: false, badge: null },
    { name: "BASIC", viewsAmount: 6000, price: 6.00, originalPrice: 11.00, isPopular: false, badge: null },
    { name: "GROWTH", viewsAmount: 7000, price: 7.00, originalPrice: 13.00, isPopular: false, badge: null },
    { name: "PRO", viewsAmount: 8000, price: 8.00, originalPrice: 14.00, isPopular: true, badge: "⭐ POPULAR" },
    { name: "PRO+", viewsAmount: 9000, price: 9.00, originalPrice: 16.00, isPopular: false, badge: null },
    { name: "ADVANCED", viewsAmount: 10000, price: 10.00, originalPrice: 18.00, isPopular: false, badge: null },
    { name: "PREMIUM", viewsAmount: 11000, price: 11.00, originalPrice: 20.00, isPopular: false, badge: null },
    { name: "MASTER", viewsAmount: 12000, price: 12.00, originalPrice: 22.00, isPopular: false, badge: null },
    { name: "ELITE", viewsAmount: 13000, price: 13.00, originalPrice: 23.00, isPopular: false, badge: null },
    { name: "PLATINUM", viewsAmount: 14000, price: 14.00, originalPrice: 25.00, isPopular: false, badge: null },
    { name: "VIRAL", viewsAmount: 28000, price: 28.00, originalPrice: 50.00, isPopular: true, badge: "🔥 HOT" },
    { name: "INFLUENCER", viewsAmount: 80000, price: 80.00, originalPrice: 144.00, isPopular: true, badge: "⚡ MAIS VENDIDO" },
    { name: "SUPREME", viewsAmount: 130000, price: 130.00, originalPrice: 234.00, isPopular: false, badge: null },
    { name: "MEGA", viewsAmount: 350000, price: 250.00, originalPrice: 450.00, isPopular: true, badge: "💎 PREMIUM" },
    { name: "ULTIMATE", viewsAmount: 600000, price: 150.00, originalPrice: 600.00, isPopular: true, badge: "🎉 OFERTA ESPECIAL" },
    { name: "ULTRA", viewsAmount: 700000, price: 200.00, originalPrice: 360.00, isPopular: true, badge: "🔥 HOT DEAL" },
    { name: "1 MILHÃO", viewsAmount: 1000000, price: 400.00, originalPrice: 720.00, isPopular: true, badge: "👑 MEGA PACK" },
  ];

  for (const planData of plansList) {
    await prisma.plan.create({
      data: planData,
    });
  }

  console.log("Seed finalizado com sucesso!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
