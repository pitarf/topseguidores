import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

async function test() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const plans = await prisma.plan.findMany()
    console.log("PLANOS ENCONTRADOS NO BANCO:", JSON.stringify(plans, null, 2))
    console.log("TOTAL:", plans.length)
  } catch (e) {
    console.error("ERRO AO BUSCAR PLANOS:", e)
  } finally {
    await prisma.$disconnect()
  }
}

test()
