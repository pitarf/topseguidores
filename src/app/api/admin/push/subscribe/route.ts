import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Dados de assinatura inválidos." },
        { status: 400 }
      );
    }

    // Salva ou atualiza a assinatura do aparelho
    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ success: true, id: sub.id });
  } catch (error: any) {
    console.error("Erro ao salvar assinatura de push:", error);
    return NextResponse.json(
      { error: "Falha ao registrar assinatura de notificação." },
      { status: 500 }
    );
  }
}
