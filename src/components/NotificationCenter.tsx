"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, Check, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  orderId?: string | null;
  amount?: number | null;
  price?: number | null;
  read: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

  // Carregar notificações e verificar status do Web Push
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications?limit=40");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error("Erro ao carregar notificações:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling leve a cada 30s se o painel estiver aberto

    // Verificar se já tem permissão e assinatura ativa de push
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }

    return () => clearInterval(interval);
  }, []);

  // Ativar Notificações Web Push neste dispositivo
  const handleEnablePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Seu navegador não suporta notificações Web Push.");
      return;
    }

    if (!vapidKey) {
      toast.error("Chave VAPID pública não configurada.");
      return;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permissão de notificação negada no navegador.");
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      // Envia a assinatura para salvar no banco
      const subJson = subscription.toJSON();
      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast.success("Dispositivo conectado! Você receberá alertas a cada compra.");
      } else {
        toast.error("Falha ao registrar assinatura no servidor.");
      }
    } catch (err: any) {
      console.error("Erro ao ativar push:", err);
      toast.error(err.message || "Não foi possível ativar as notificações.");
    } finally {
      setLoading(false);
    }
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Erro ao marcar lidas:", e);
    }
  };

  return (
    <div className="relative">
      {/* Botão de Sino */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            handleMarkAllAsRead();
          }
        }}
        className="relative p-2.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
        title="Central de Compras (Últimos 7 dias)"
      >
        <Bell className="w-5 h-5 text-zinc-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 rounded-full bg-primary text-[10px] font-black text-white shadow-[0_0_10px_rgba(255,0,62,0.8)] animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-3 top-20 md:static md:inset-auto md:absolute md:right-0 md:mt-3 w-auto md:w-96 rounded-2xl bg-[#0b111e] border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh] md:max-h-[500px]">
            {/* Header do Menu */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Compras Recentes
                </h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                Últimos 7 dias
              </span>
            </div>

            {/* Banner de Ativação do Web Push no Celular/PC */}
            <div className="p-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between gap-3">
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-white">
                  {isSubscribed ? "Notificações ativas neste aparelho" : "Receber alertas no celular/web"}
                </p>
                <p className="text-zinc-400 text-[10px] mt-0.5">
                  {isSubscribed ? "Você recebe pop-ups a cada venda" : "Ative para ser alertado instantaneamente"}
                </p>
              </div>

              <button
                onClick={handleEnablePush}
                disabled={loading || isSubscribed}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  isSubscribed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_12px_rgba(255,0,62,0.4)]"
                }`}
              >
                {loading ? "..." : isSubscribed ? "Ativo ✓" : "Ativar"}
              </button>
            </div>

            {/* Lista Acumulativa de Notificações */}
            <div className="overflow-y-auto flex-1 divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-zinc-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-bold">Nenhuma compra registrada nos últimos 7 dias.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors hover:bg-white/[0.03] flex items-start gap-3 ${
                      !item.read ? "bg-primary/[0.04]" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white truncate">
                          {item.title}
                        </p>
                        <span className="text-[9px] font-medium text-zinc-500 shrink-0">
                          {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed break-words">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px]">
                <span className="text-zinc-500 font-medium">
                  {notifications.length} {notifications.length === 1 ? "venda" : "vendas"} acumuladas
                </span>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-zinc-400 hover:text-white font-bold transition-colors"
                >
                  Marcar todas como lidas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
