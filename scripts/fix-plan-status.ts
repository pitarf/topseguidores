import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  console.log("Iniciando correção de status dos planos...");

  // 1. Atualiza o Pacote Teste (antigo MINI)
  // Tentamos encontrar por nome "MINI" ou "Pacote Teste"
  const plan = await prisma.plan.findFirst({
    where: {
      OR: [
        { name: "MINI" },
        { name: "Pacote Teste" }
      ]
    }
  });

  if (plan) {
    await prisma.plan.update({
      where: { id: plan.id },
      data: {
        name: "Pacote Teste",
        isPopular: true,
        badge: "💎 TESTE"
      }
    });
    console.log("✅ Pacote Teste atualizado com sucesso!");
  } else {
    console.log("⚠️ Pacote Teste não encontrado.");
  }

  // 2. Garante que as configurações tenham o campo showNotifications (embora o db push já faça isso)
  await prisma.systemSetting.upsert({
    where: { id: "1" },
    update: {
      showNotifications: true
    },
    create: {
      id: "1",
      siteTitle: "Viraliza Reels",
      showNotifications: true
    }
  });

  console.log("🚀 Correção finalizada!");
  await prisma.$disconnect();
}

main().catch(console.error);
