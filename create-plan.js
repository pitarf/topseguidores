const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.plan.create({
    data: {
      name: "Teste de Homologação",
      viewsAmount: 100,
      price: 1.00,
      originalPrice: 5.00,
      isPopular: false
    }
  });
  console.log("✅ Plano de 100 views criado com sucesso!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
