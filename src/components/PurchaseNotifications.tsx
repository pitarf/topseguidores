"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

const usernames = [
  "lucas_silva", "mariah_oficial", "joao.pedro", "ana_influencer",
  "gabriel_reels", "carol_vlogs", "teclandow", "fit_journey",
  "viagens_pelo_mundo", "dicas_de_casa", "chef_marcelo", "beleza_pura",
  "rafael_vlog", "giulia_fashion", "pedro_games", "thais_beauty"
];

const plans = ["5.000 views", "10.000 views", "1.000 views", "50.000 views", "100.000 views"];

export function PurchaseNotifications() {
  const pathname = usePathname();

  useEffect(() => {
    // Se estiver na administração, não ativa o timer
    if (pathname?.startsWith('/administracao')) {
      return;
    }
    const showNotification = () => {
      const user = usernames[Math.floor(Math.random() * usernames.length)];
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const randomImg = Math.floor(Math.random() * 50) + 1;
      
      toast(
        <div className="flex items-center gap-4 py-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 overflow-hidden bg-zinc-800">
              <img 
                src={`https://i.pravatar.cc/150?u=${user}`} 
                alt={user} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-zinc-950 flex items-center justify-center">
              <Check className="w-3 h-3 text-white stroke-[4px]" />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-black text-white leading-tight">@{user}</p>
            <p className="text-xs text-zinc-400 font-medium tracking-tight">
              Acabou de comprar <span className="text-primary font-bold">{plan}</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-bold uppercase">Confirmado agora</p>
          </div>
        </div>,
        {
          duration: 5000,
          className: "glass-morphism !bg-black/80 !border-white/10 !rounded-2xl shadow-2xl",
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
