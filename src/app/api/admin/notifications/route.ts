import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Retorna notificações dos últimos 7 dias
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const [notifications, unreadCount] = await Promise.all([
      prisma.adminNotification.findMany({
        where: {
          createdAt: {
            gte: seteDiasAtras,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.adminNotification.count({
        where: {
          read: false,
          createdAt: {
            gte: seteDiasAtras,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Erro ao listar notificações:", error);
    return NextResponse.json(
      { error: "Falha ao buscar histórico de notificações." },
      { status: 500 }
    );
  }
}

// Marcar notificações como lidas
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id } = body;

    if (id) {
      await prisma.adminNotification.update({
        where: { id },
        data: { read: true },
      });
    } else {
      // Marcar todas como lidas
      await prisma.adminNotification.updateMany({
        where: { read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar status da notificação:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar notificação." },
      { status: 500 }
    );
  }
}
