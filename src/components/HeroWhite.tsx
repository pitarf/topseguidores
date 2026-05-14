"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeroWhiteProps {
  title?: string;
  description?: string;
}

export function HeroWhite({ title, description }: HeroWhiteProps) {
  return (
    <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#030712]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-zinc-300 uppercase tracking-widest">
              Plataforma número #1 em Engajamento
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black leading-tight tracking-tighter text-white mb-6"
          >
            {title || "Sua presença digital levada ao próximo nível"}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-base md:text-xl font-medium mb-10 max-w-2xl px-4 leading-relaxed"
          >
            {description || "Aumente sua autoridade, conquiste novos públicos e destaque-se no mercado digital com as melhores ferramentas de crescimento do Brasil."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4"
          >
            <Link 
              href="/home"
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black text-base md:text-lg rounded-2xl transition-all duration-300 btn-primary-gradient shadow-[0_20px_40px_rgba(255,0,0,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Começar agora
              <ChevronRight className="w-5 h-5" />
            </Link>
            
            <a 
              href="#como-funciona"
              className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white font-bold text-base md:text-lg rounded-2xl border border-white/10 transition-all hover:bg-white/10 flex items-center justify-center gap-2"
            >
              Saiba mais
            </a>
          </motion.div>

          {/* Minimal Trust Items */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 border-t border-white/5 pt-12 w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter">Instantâneo</span>
              <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Entrega Imediata</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter">100% Seguro</span>
              <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Sem risco para sua conta</span>
            </div>
            
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter">Resultados</span>
              <span className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Crescimento Orgânico</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
