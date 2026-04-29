const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const plans = [
  { name: "MINI", viewsAmount: 1000, price: 3.00, originalPrice: 5.00, isPopular: false, badge: null },
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

async function main() {
  console.log("Apagando planos antigos...");
  await prisma.plan.deleteMany();
  
  console.log("Criando 18 novos planos sincronizados...");
  for (const plan of plans) {
    await prisma.plan.create({ data: plan });
  }

  console.log("Verificando configurações do sistema...");
  const settingsCount = await prisma.systemSetting.count();
  if (settingsCount === 0) {
    await prisma.systemSetting.create({
      data: {
        siteTitle: "Viraliza Reels - Comprar Visualizações Instagram",
        siteDescription: "Aumente seu engajamento no Reels de forma rápida e segura.",
        siteKeywords: "comprar visualizações, instagram reels, engajamento, redes sociais",
        faviconUrl: "/icon.svg"
      }
    });
    console.log("✅ Configurações iniciais criadas!");
  }
  
  console.log("✅ 18 planos criados e sincronizados com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
