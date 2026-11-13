"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Lock, Zap, BarChart2, Instagram } from "lucide-react";
import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";

interface ViralizaHeroProps {
  title?: string;
}

export function ViralizaHero({ title }: ViralizaHeroProps) {
  const { openCheckout } = useCheckout();
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");

  return (
    <section className="relative w-full overflow-hidden bg-[#070b14] pt-8 pb-10">
      {/* Top Banner Azul - Seguidores • Curtidas • Visualizações */}
      <div className="w-full bg-[#1d4ed8] py-2 px-4 shadow-md flex justify-center items-center">
        <p className="text-white text-xs md:text-sm font-bold tracking-wide text-center">
          Seguidores &bull; Curtidas &bull; Visualizações
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-xl relative z-10 pt-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo / Título Principal */}
          <motion.h1 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-[1000] tracking-tight text-[#3b82f6] mb-2 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          >
            {title || "ViralizaReels"}
          </motion.h1>

          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-200 text-sm sm:text-base font-semibold mb-6 px-2"
          >
            Mais seguidores, curtidas e views sem complicação.
          </motion.p>

          {/* Grid 2x2 de Benefícios Rápidos */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-2.5 w-full mb-6"
          >
            <div className="flex items-center gap-2.5 bg-[#0d1527] border border-[#1e293b] py-3 px-3.5 rounded-xl shadow-sm">
              <ShoppingBag className="w-5 h-5 text-[#3b82f6] shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold text-left leading-tight">
                Pedido anônimo
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#0d1527] border border-[#1e293b] py-3 px-3.5 rounded-xl shadow-sm">
              <Lock className="w-5 h-5 text-[#3b82f6] shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold text-left leading-tight">
                Sem pedir sua senha
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#0d1527] border border-[#1e293b] py-3 px-3.5 rounded-xl shadow-sm">
              <Zap className="w-5 h-5 text-[#3b82f6] shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold text-left leading-tight">
                Início a partir de 5 min
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-[#0d1527] border border-[#1e293b] py-3 px-3.5 rounded-xl shadow-sm">
              <BarChart2 className="w-5 h-5 text-[#3b82f6] shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold text-left leading-tight">
                Acompanhe seu pedido
              </span>
            </div>
          </motion.div>

          {/* Card Seletor de Opção */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-[#0a101f] border border-[#1e293b] rounded-3xl p-5 sm:p-7 shadow-xl"
          >
            <h2 className="text-lg sm:text-xl font-[900] text-white mb-1 tracking-tight">
              Escolha a melhor opção
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium mb-5">
              Encontre o serviço certo para você e comece agora.
            </p>

            {/* Plataformas Instagram / TikTok */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* Instagram */}
              <button 
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  platform === "instagram" 
                    ? "border-[#3b82f6] bg-[#1e3a8a]/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                    : "border-[#1e293b] bg-[#0d1527] hover:border-zinc-700"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  platform === "instagram" ? "bg-[#2563eb] text-white shadow-md" : "bg-[#162238] text-zinc-400"
                }`}>
                  <Instagram className="w-6 h-6" />
                </div>
                <span className={`text-xs sm:text-sm font-black tracking-wide ${
                  platform === "instagram" ? "text-white" : "text-zinc-400"
                }`}>
                  Instagram
                </span>
              </button>

              {/* TikTok */}
              <button 
                type="button"
                onClick={() => setPlatform("tiktok")}
                className={`flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  platform === "tiktok" 
                    ? "border-[#3b82f6] bg-[#1e3a8a]/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                    : "border-[#1e293b] bg-[#0d1527] hover:border-zinc-700"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  platform === "tiktok" ? "bg-[#2563eb] text-white shadow-md" : "bg-[#162238] text-zinc-400"
                }`}>
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.41-.21-.14-.41-.29-.61-.44v7.35c.02 1.33-.29 2.7-.93 3.86-.71 1.41-1.95 2.58-3.41 3.19-1.42.63-3.04.83-4.57.56-1.52-.23-3.03-.98-4.14-2.07-1.3-1.21-2.12-2.91-2.29-4.69-.19-1.54.12-3.17.89-4.57.77-1.5 2.14-2.73 3.73-3.34 1.4-.57 2.97-.68 4.44-.32v4.29c-.88-.23-1.84-.2-2.69.21-.92.41-1.63 1.25-1.9 2.21-.14.49-.17.99-.11 1.49.09.91.56 1.78 1.28 2.36.75.64 1.76.92 2.75.83 1.01-.06 1.98-.56 2.61-1.35.53-.61.79-1.42.78-2.22V0h.01z"/>
                  </svg>
                </div>
                <span className={`text-xs sm:text-sm font-black tracking-wide ${
                  platform === "tiktok" ? "text-white" : "text-zinc-400"
                }`}>
                  Tiktok
                </span>
              </button>
            </div>

            {/* Botão de Ação */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => openCheckout(platform)}
              className="w-full py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-[900] text-sm sm:text-base rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Começar agora 🚀
            </motion.button>

            <p className="mt-4 text-zinc-500 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              ESCOLHA SUA REDE E CONFIRA OS PACOTES
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
