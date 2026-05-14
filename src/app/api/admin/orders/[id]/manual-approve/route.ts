import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.update({
      where: { id },
      data: {
        panelOrderId: "MANUAL",
        smmError: null,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Erro ao aprovar manualmente:", error);
    return NextResponse.json(
      { error: "Erro ao processar aprovação manual." },
      { status: 500 }
    );
  }
}
