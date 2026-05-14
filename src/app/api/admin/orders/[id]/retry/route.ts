import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToPerfectPanel } from "@/services/perfectpanel";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Buscar o pedido e o plano associado
    const order = await prisma.order.findUnique({
      where: { id },
      include: { plan: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    if (order.status !== "SUCCESS") {
      return NextResponse.json({ error: "Apenas pedidos pagos podem ser enviados ao SMM" }, { status: 400 });
    }

    // 2. Tentar enviar para o PerfectPanel novamente
    console.log(`🔄 Reenviando pedido ${order.id} para SMM...`);
    const result = await sendOrderToPerfectPanel(
      order.instagramUrl,
      order.amount,
      order.plan.providerServiceId || undefined
    );

    if (result.error) {
      await prisma.order.update({
        where: { id },
        data: { smmError: result.error },
      });
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // 3. Atualizar o pedido com o novo ID do painel
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        panelOrderId: result.orderId,
        smmError: null
      },
    });

    return NextResponse.json({ success: true, panelOrderId: updatedOrder.panelOrderId });
  } catch (error: any) {
    console.error("Erro no retry do pedido:", error);
    return NextResponse.json({ error: error.message || "Erro interno ao processar reenvio" }, { status: 500 });
  }
}
