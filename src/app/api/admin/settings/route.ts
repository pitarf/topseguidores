import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Atualiza ou cria a linha de configurações única (ID: 1)
    const settings = await prisma.systemSetting.upsert({
      where: { id: "1" },
      update: data,
      create: { id: "1", ...data }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao salvar config:", error);
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}
