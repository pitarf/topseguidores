import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { id } = params;

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return NextResponse.json({ error: "Erro ao atualizar plano" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar plano" }, { status: 500 });
  }
}
