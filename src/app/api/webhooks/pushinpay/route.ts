import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToPerfectPanel } from "@/services/perfectpanel";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    console.log("PushinPay Webhook Received:", body);

    // 1. Validar Status
    if (body.status === "paid" || body.status === "approved") {
      const orderId = body.external_id || body.reference_id || searchParams.get("orderId");

      if (!orderId) {
        return NextResponse.json({ error: "External ID missing" }, { status: 400 });
      }

      // 2. Localizar pedido
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (order.status === "SUCCESS") {
        return NextResponse.json({ message: "Already processed" });
      }

      // 3. Disparar API de entrega (PerfectPanel)
      const panelOrderId = await sendOrderToPerfectPanel(order.instagramUrl, order.amount);

      // 4. Marcar como pago e salvar o ID do Painel
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "SUCCESS",
          panelOrderId: panelOrderId || null,
        },
      });

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
