import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:contato@viralizareels.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PurchaseNotificationPayload {
  title: string;
  message: string;
  orderId?: string;
  amount?: number;
  price?: number;
  url?: string;
}

/**
 * Envia notificação Web Push para todos os aparelhos cadastrados do administrador
 * e registra no banco de dados para acumular no histórico dos últimos 7 dias.
 */
export async function sendAdminPurchaseNotification(payload: PurchaseNotificationPayload) {
  try {
    // 1. Salvar no histórico acumulativo do painel
    await prisma.adminNotification.create({
      data: {
        title: payload.title,
        message: payload.message,
        orderId: payload.orderId || null,
        amount: payload.amount || null,
        price: payload.price !== undefined ? payload.price : null,
      },
    });

    // 2. Limpar notificações com mais de 7 dias automaticamente para manter a base enxuta
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    await prisma.adminNotification.deleteMany({
      where: {
        createdAt: {
          lt: seteDiasAtras,
        },
      },
    }).catch((e) => console.warn("Aviso ao limpar notificações antigas:", e));

    // 3. Buscar assinaturas ativas de Web Push
    const subscriptions = await prisma.pushSubscription.findMany();
    if (subscriptions.length === 0) {
      console.log("ℹ️ Nenhuma assinatura de Web Push cadastrada no momento.");
      return;
    }

    const notificationData = JSON.stringify({
      title: payload.title,
      body: payload.message,
      icon: "/favicon.png",
      badge: "/favicon.png",
      data: {
        url: payload.url || "/administracao",
        orderId: payload.orderId,
      },
      vibrate: [200, 100, 200, 100, 200],
      tag: `compra-${payload.orderId || Date.now()}`,
    });

    // 4. Disparar para todos os dispositivos em paralelo
    const promises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushConfig, notificationData);
      } catch (err: any) {
        // Se a assinatura expirou ou o usuário revogou a permissão (410 ou 404), removemos do banco
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`🗑️ Removendo assinatura expirada: ${sub.id}`);
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error(`❌ Erro ao enviar push para ${sub.id}:`, err.message || err);
        }
      }
    });

    await Promise.all(promises);
    console.log(`✅ Web Push disparado para ${subscriptions.length} dispositivo(s).`);
  } catch (error) {
    console.error("❌ Falha geral em sendAdminPurchaseNotification:", error);
  }
}
