import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function test() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connection successful!");
    
    const settings = await prisma.systemSetting.findFirst();
    console.log("Settings found:", settings);
    
  } catch (err: any) {
    console.error("DETAILED ERROR:", err.message);
    if (err.cause) {
      console.error("CAUSE MESSAGE:", err.cause.message);
      console.error("CAUSE STACK:", err.cause.stack);
      console.dir(err.cause, { depth: null });
    } else {
      console.dir(err, { depth: null });
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
