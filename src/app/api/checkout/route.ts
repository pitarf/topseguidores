import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { planId, instagramUrl, email, whatsapp } = await req.json();
    console.log(`🛒 Checkout Request: ${planId} | ${instagramUrl} | ${email} | ${whatsapp}`);

    if (!planId || !instagramUrl) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    }

    // 1. Criar pedido no nosso banco
    const order = await prisma.order.create({
      data: {
        instagramUrl,
        customerEmail: email,
        customerWhatsapp: whatsapp,
        amount: plan.viewsAmount,
        price: plan.price,
        planId: plan.id,
        status: "PENDING",
      },
    });

    // 2. Chamar API da PushinPay
    const settings = await prisma.systemSetting.findFirst();
    const PUSHINPAY_TOKEN = settings?.pushinpayToken || process.env.PUSHINPAY_TOKEN;
    const WEBHOOK_TOKEN = settings?.pushinpayWebhookToken || process.env.PUSHINPAY_WEBHOOK_TOKEN;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://viralizareels.com';
    const WEBHOOK_URL = `${APP_URL}/api/webhooks/pushinpay?orderId=${order.id}&token=${WEBHOOK_TOKEN}`;

    const response = await fetch("https://api.pushinpay.com.br/api/pix/cashIn", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PUSHINPAY_TOKEN}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: Math.round(Number(plan.price) * 100),
        webhook_url: WEBHOOK_URL,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro PushinPay:", data);
      return NextResponse.json({ error: "Erro ao gerar PIX" }, { status: 500 });
    }

    // 3. Atualizar pedido com os dados do PIX
    await prisma.order.update({
      where: { id: order.id },
      data: {
        pixCode: data.qr_code,
        pixQrCodeBase64: data.qr_code_base64,
        paymentId: String(data.id), // ID da transação na PushinPay
      },
    });

    return NextResponse.json({
      orderId: order.id,
      pixCode: data.qr_code,
      pixQrCodeBase64: data.qr_code_base64,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
