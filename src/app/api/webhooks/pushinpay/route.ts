import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToPerfectPanel } from "@/services/perfectpanel";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const urlToken = searchParams.get("token");
    const urlOrderId = searchParams.get("orderId");
    
    const contentType = req.headers.get("content-type") || "";
    console.log(`🌐 Webhook Content-Type: ${contentType}`);

    // 1. Tentar ler o body de forma flexível
    let body: any = {};
    try {
      const rawBody = await req.text();
      console.log("📦 Raw Webhook Body:", rawBody);
      
      if (contentType.includes("application/json")) {
        body = JSON.parse(rawBody);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(rawBody);
        body = Object.fromEntries(params.entries());
      } else {
        // Tenta parsear como JSON mesmo se o header estiver errado
        try {
          body = JSON.parse(rawBody);
        } catch {
          console.warn("⚠️ Formato de body desconhecido e não é JSON válido.");
        }
      }
    } catch (e) {
      console.error("❌ Erro ao ler body da requisição:", e);
      return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
    }

    // 2. Validar Token de Segurança
    const settings = await prisma.systemSetting.findFirst();
    const WEBHOOK_TOKEN = settings?.pushinpayWebhookToken || process.env.PUSHINPAY_WEBHOOK_TOKEN;
    if (!urlToken || urlToken !== WEBHOOK_TOKEN) {
      console.warn(`⚠️ Tentativa de acesso não autorizada! Token recebido: ${urlToken}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Verificar Status do Pagamento
    const status = body.status || body.state; // Alguns gateways usam state
    if (status === "paid" || status === "approved" || status === "CONCLUIDO") {
      const orderId = body.external_id || body.reference_id || urlOrderId;

      if (!orderId) {
        console.error("❌ Order ID não encontrado no Webhook!");
        return NextResponse.json({ error: "External ID missing" }, { status: 400 });
      }

      console.log(`🔍 Processando pagamento para Order: ${orderId}`);

      // 4. Bloqueio Atômico (Mutex)
      try {
        const updateResult = await prisma.order.updateMany({
          where: { 
            id: orderId,
            status: "PENDING" 
          },
          data: {
            status: "SUCCESS" 
          }
        });

        if (updateResult.count === 0) {
          console.log(`ℹ️ Pedido ${orderId} já foi processado ou não está mais PENDING.`);
          return NextResponse.json({ message: "Already processed" });
        }
      } catch (prismaErr) {
        console.error("❌ Erro de Banco de Dados no Webhook:", prismaErr);
        throw prismaErr; // Repassa para o catch principal
      }

      // 5. Buscar dados do pedido para entrega
      const order = await prisma.order.findUnique({ 
        where: { id: orderId },
        include: { plan: true }
      });
      if (!order) {
        console.error(`❌ Pedido ${orderId} não encontrado no banco após update!`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 6. Entrega SMM (PerfectPanel)
      try {
        console.log(`🚀 Disparando entrega SMM para: ${order.instagramUrl}`);
        const result = await sendOrderToPerfectPanel(
          order.instagramUrl, 
          order.amount,
          order.plan.providerServiceId || undefined
        );
        
        if (result.orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { 
              panelOrderId: result.orderId,
              smmError: null 
            },
          });
          console.log(`✅ Pedido entregue! Painel ID: ${result.orderId}`);
        } else {
          await prisma.order.update({
            where: { id: orderId },
            data: { smmError: result.error || "Erro desconhecido no painel" },
          });
          console.error("⚠️ Falha ao registrar ID do painel:", result.error);
        }
      } catch (smmErr) {
        console.error("❌ Erro crítico na entrega SMM:", smmErr);
        // Não jogamos erro aqui para não invalidar o webhook se o pagamento foi OK
      }

      // 7. Trackeamento Facebook CAPI
      try {
        const settings = await prisma.systemSetting.findFirst();
        if (settings?.fbPixelId && settings?.fbApiToken) {
          const eventData = {
            data: [{
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              event_source_url: 'https://viralizareels.com',
              user_data: {
                client_ip_address: req.headers.get("x-forwarded-for")?.split(',')[0] || req.headers.get("x-real-ip") || "127.0.0.1",
                client_user_agent: req.headers.get("user-agent") || ""
              },
              custom_data: {
                currency: 'BRL',
                value: Number(order.price)
              }
            }]
          };

          fetch(`https://graph.facebook.com/v19.0/${settings.fbPixelId}/events?access_token=${settings.fbApiToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          }).catch(e => console.error("Erro assíncrono no CAPI:", e));
        }
      } catch (capiErr) {
        console.error("⚠️ Erro ao processar CAPI:", capiErr);
      }
    } else {
      console.log(`ℹ️ Webhook recebido com status irrelevante: ${status}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("🚨 CRITICAL WEBHOOK ERROR:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error", detail: error.message }, 
      { status: 500 }
    );
  }
}
