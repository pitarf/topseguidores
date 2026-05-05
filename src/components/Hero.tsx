"use client";

import { motion } from "framer-motion";
import { Instagram, Smartphone, CheckCircle, Users, Zap, Search, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";

export function Hero() {
  const { openCheckout } = useCheckout();
  const [timeLeft, setTimeLeft] = useState("13:42");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");

  useEffect(() => {
    // Apenas para manter o visual do contador dinâmico
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    }, 60000);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative w-full pt-12 pb-8 md:pt-20 md:pb-16 overflow-hidden hero-gradient">
      {/* Top Banner - Texto Exato da Ref */}
      <div className="fixed top-0 left-0 w-full bg-primary z-[60] py-1.5 px-4 shadow-lg flex justify-center items-center gap-2">
        <p className="text-white text-[10px] md:text-xs font-bold flex items-center gap-1.5 text-center">
          ⚡ Mais de 500 pedidos hoje <span className="opacity-50">|</span> ⌛ {timeLeft}
        </p>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Headline Principal - Mais Compacta */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-[1000] leading-tight tracking-tighter text-white mb-2 neon-text-blue px-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            Aumente seus seguidores e faça seu perfil crescer de verdade 🚀
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-[10px] md:text-base font-medium mb-4 max-w-2xl px-4"
          >
            Ganhe autoridade e destaque nas redes sociais com entrega rápida e segura.
          </motion.p>

          {/* Badges de Confiança - Mais Compactos e Próximos */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 px-4"
          >
            <div className="flex items-center gap-1.5 bg-[#0a0f1e]/80 border border-white/5 py-1 px-3 rounded-full text-zinc-300 text-[8px] md:text-[10px] font-bold">
              <Users className="w-3 h-3 text-blue-400" /> +10.000 clientes atendidos
            </div>
            <div className="flex items-center gap-1.5 bg-[#0a0f1e]/80 border border-white/5 py-1 px-3 rounded-full text-zinc-300 text-[8px] md:text-[10px] font-bold">
              <Zap className="w-3 h-3 text-blue-400" /> Entrega em até 5 min
            </div>
            <div className="flex items-center gap-1.5 bg-[#0a0f1e]/80 border border-white/5 py-1 px-3 rounded-full text-zinc-300 text-[8px] md:text-[10px] font-bold">
              <Zap className="w-3 h-3 text-[#10b981]" /> A partir de R$ 3,29
            </div>
            <div className="flex items-center gap-1.5 bg-[#0a0f1e]/80 border border-white/5 py-1 px-3 rounded-full text-zinc-300 text-[8px] md:text-[10px] font-bold">
              <Search className="w-3 h-3 text-orange-400" /> Rastrear meu pedido
            </div>
          </motion.div>

          {/* Platform Selector Section - Compacto */}
          <div className="w-full max-w-2xl bg-secondary/20 backdrop-blur-sm border border-white/5 rounded-[2rem] p-4 md:p-8 mb-6 mx-4">
            <h2 className="text-base md:text-xl font-black text-white mb-0.5">Escolha a melhor opção</h2>
            <p className="text-zinc-500 text-[9px] md:text-xs font-medium mb-4">Encontre o serviço certo para você e comece agora.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setPlatform("instagram")}
                className={`group relative p-4 md:p-6 rounded-[1.2rem] border-2 transition-all duration-500 flex flex-col items-center gap-2 ${
                  platform === "instagram" 
                  ? "border-primary bg-primary/10 scale-105" 
                  : "border-white/5 bg-white/5"
                }`}
              >
                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  platform === "instagram" ? "bg-primary text-white" : "bg-white/5 text-primary"
                }`}>
                  <Instagram className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <span className={`font-black text-[10px] md:text-sm tracking-tight ${
                  platform === "instagram" ? "text-white" : "text-zinc-500"
                }`}>Instagram</span>
              </button>

              <button 
                onClick={() => setPlatform("tiktok")}
                className={`group relative p-4 md:p-6 rounded-[1.2rem] border-2 transition-all duration-500 flex flex-col items-center gap-2 ${
                  platform === "tiktok" 
                  ? "border-primary bg-primary/10 scale-105" 
                  : "border-white/5 bg-white/5"
                }`}
              >
                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  platform === "tiktok" ? "bg-primary text-white" : "bg-white/5 text-primary"
                }`}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-7 md:h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.41-.21-.14-.41-.29-.61-.44v7.35c.02 1.33-.29 2.7-.93 3.86-.71 1.41-1.95 2.58-3.41 3.19-1.42.63-3.04.83-4.57.56-1.52-.23-3.03-.98-4.14-2.07-1.3-1.21-2.12-2.91-2.29-4.69-.19-1.54.12-3.17.89-4.57.77-1.5 2.14-2.73 3.73-3.34 1.4-.57 2.97-.68 4.44-.32v4.29c-.88-.23-1.84-.2-2.69.21-.92.41-1.63 1.25-1.9 2.21-.14.49-.17.99-.11 1.49.09.91.56 1.78 1.28 2.36.75.64 1.76.92 2.75.83 1.01-.06 1.98-.56 2.61-1.35.53-.61.79-1.42.78-2.22V0h.01z"/>
                  </svg>
                </div>
                <span className={`font-black text-[10px] md:text-sm tracking-tight ${
                  platform === "tiktok" ? "text-white" : "text-zinc-500"
                }`}>Tiktok</span>
              </button>
            </div>

            <motion.button
              onClick={() => openCheckout(platform)}
              className="w-full py-3.5 bg-primary text-white font-black text-xs md:text-base rounded-xl transition-all duration-300 btn-primary-gradient animate-pulse-blue flex items-center justify-center gap-2 shadow-2xl"
            >
              Começar agora 🚀
            </motion.button>
            
            <p className="mt-3 text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
              Alta demanda hoje — entrega iniciada em até 5 minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
