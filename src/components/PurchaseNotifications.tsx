"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Instagram } from "lucide-react";

const usernames = [
  "lucas_silva", "mariah_oficial", "joao.pedro", "ana_influencer",
  "gabriel_reels", "carol_vlogs", "teclandow", "fit_journey",
  "viagens_pelo_mundo", "dicas_de_casa", "chef_marcelo", "beleza_pura",
  "rafael_vlog", "giulia_fashion", "pedro_games", "thais_beauty"
];

const plans = ["5.000 views", "10.000 views", "1.000 views", "50.000 views", "100.000 views"];

export function PurchaseNotifications({ enabled = true }: { enabled?: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    // Se estiver desativado pelo admin ou se estiver na administração, não faz nada
    if (!enabled || pathname?.startsWith('/administracao')) {
      return;
    }
    const showNotification = () => {
      const user = usernames[Math.floor(Math.random() * usernames.length)];
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const randomImg = Math.floor(Math.random() * 50) + 1;
      
      toast(
        <div className="flex items-center gap-4 py-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
            <Instagram className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Instagram</span>
               <span className="text-[10px] font-bold text-zinc-600">Agora</span>
            </div>
            <p className="text-[12px] font-medium text-zinc-400 leading-snug">
               <span className="font-black text-white">{user}</span> acabou de comprar <span className="font-black text-white">{plan}</span>
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          className: "!bg-[#0a0f1e]/95 !border-white/5 !rounded-2xl shadow-2xl pointer-events-none",
          position: "bottom-left",
        }
      );
    };

    // Primeira notificação após 5 segundos
    const initialTimer = setTimeout(showNotification, 5000);

    // Notificações subsequentes aleatórias
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * (25000 - 10000) + 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
