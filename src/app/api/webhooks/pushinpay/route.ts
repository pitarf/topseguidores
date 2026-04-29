import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToPerfectPanel } from "@/services/perfectpanel";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    console.log("PushinPay Webhook Received:", body);

    // 1. Validar Token de Segurança e Status
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'fallback-secret';
    const token = searchParams.get("token");

    if (token !== WEBHOOK_SECRET) {
      console.warn("⚠️ Tentativa de acesso não autorizada ao Webhook!");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.status === "paid" || body.status === "approved") {
      const orderId = body.external_id || body.reference_id || searchParams.get("orderId");

      if (!orderId) {
        return NextResponse.json({ error: "External ID missing" }, { status: 400 });
      }

      // 2. Localizar e Bloquear pedido para evitar Condição de Corrida (Atomicidade)
      // Usamos updateMany com status PENDING para garantir que apenas 1 processo consiga "pegar" o pedido
      const updateResult = await prisma.order.updateMany({
        where: { 
          id: orderId,
          status: "PENDING" // Só processa se ainda estiver pendente
        },
        data: {
          status: "SUCCESS" 
        }
      });

      if (updateResult.count === 0) {
        // Se count for 0, significa que o pedido já foi processado ou não existe
        return NextResponse.json({ message: "Already processed or not found" });
      }

      // Agora buscamos o pedido para ter os dados de entrega
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return NextResponse.json({ error: "Fatal error" }, { status: 500 });

      // 3. Disparar API de entrega (PerfectPanel)
      const panelOrderId = await sendOrderToPerfectPanel(order.instagramUrl, order.amount);

      // 4. Salvar o ID do Painel se houver
      if (panelOrderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { panelOrderId },
        });
      }

      console.log(`✅ Pedido ${orderId} PAGO! API de entrega processada (Painel ID: ${panelOrderId}).`);

      // 5. Facebook CAPI - Purchase Event (Trackeamento 100% Backend)
      try {
        const settings = await prisma.systemSetting.findFirst();
        if (settings?.fbPixelId && settings?.fbApiToken) {
          const eventData = {
            data: [
              {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: 'https://crescereels.com',
                user_data: {
                  // Enviamos os dados de rastreio que temos da req
                  client_ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
                  client_user_agent: req.headers.get("user-agent") || ""
                },
                custom_data: {
                  currency: 'BRL',
                  value: Number(order.price)
                }
              }
            ]
          };

          await fetch(`https://graph.facebook.com/v19.0/${settings.fbPixelId}/events?access_token=${settings.fbApiToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          });
          console.log(`✅ Evento Purchase CAPI enviado para o Pixel ${settings.fbPixelId}`);
        }
      } catch (e) {
        console.error("Erro ao enviar CAPI:", e);
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
