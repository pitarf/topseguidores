const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const plans = [
  { name: "Iniciante", viewsAmount: 500, price: 2.90, originalPrice: 9.90, isPopular: false },
  { name: "Básico", viewsAmount: 1000, price: 4.90, originalPrice: 14.90, isPopular: false },
  { name: "Crescimento", viewsAmount: 2500, price: 9.90, originalPrice: 24.90, isPopular: false },
  { name: "Econômico", viewsAmount: 5000, price: 14.90, originalPrice: 39.90, isPopular: false },
  { name: "Mais Vendido", viewsAmount: 10000, price: 24.90, originalPrice: 59.90, isPopular: true },
  { name: "Expansão", viewsAmount: 20000, price: 44.90, originalPrice: 99.90, isPopular: false },
  { name: "Intermediário", viewsAmount: 50000, price: 97.90, originalPrice: 199.90, isPopular: false },
  { name: "Profissional", viewsAmount: 100000, price: 147.90, originalPrice: 299.90, isPopular: false },
  { name: "Autoridade", viewsAmount: 200000, price: 247.90, originalPrice: 499.90, isPopular: false },
  { name: "Elite", viewsAmount: 500000, price: 497.90, originalPrice: 999.90, isPopular: false },
  { name: "Influencer", viewsAmount: 1000000, price: 897.90, originalPrice: 1799.90, isPopular: true },
  { name: "Celebridade", viewsAmount: 2000000, price: 1497.90, originalPrice: 2999.90, isPopular: false },
  { name: "Viral Gold", viewsAmount: 5000000, price: 2997.90, originalPrice: 5999.90, isPopular: false },
  { name: "Viral Platinum", viewsAmount: 10000000, price: 4997.90, originalPrice: 9999.90, isPopular: false },
  { name: "Viral Diamond", viewsAmount: 20000000, price: 8997.90, originalPrice: 17999.90, isPopular: false },
  { name: "Rei do Reels", viewsAmount: 50000000, price: 19997.90, originalPrice: 39999.90, isPopular: false },
  { name: "Lenda Digital", viewsAmount: 100000000, price: 34997.90, originalPrice: 69999.90, isPopular: false },
  { name: "Dominador Global", viewsAmount: 250000000, price: 79997.90, originalPrice: 159999.90, isPopular: false },
];

async function main() {
  console.log("Apagando planos antigos...");
  await prisma.plan.deleteMany();
  
  console.log("Criando 18 novos planos...");
  for (const plan of plans) {
    await prisma.plan.create({ data: plan });
  }
  
  console.log("✅ 18 planos criados com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
