import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.plan.updateMany({
    where: {
      name: {
        in: ['MINI', 'Mini']
      }
    },
    data: {
      name: 'Pacote Teste'
    }
  });

  console.log(`✅ Sucesso! ${result.count} plano(s) atualizado(s).`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
