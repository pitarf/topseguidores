"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Star } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-6 bg-[#030712]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-secondary/10 text-center gap-3 group hover:border-primary/30 transition-colors">
            <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest leading-tight">Pagamento 100% seguro via Pix</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-secondary/10 text-center gap-3 group hover:border-primary/30 transition-colors">
            <Lock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest leading-tight">Não pedimos sua senha</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/5 bg-secondary/10 text-center gap-3 group hover:border-primary/30 transition-colors">
            <Star className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest leading-tight">Serviço confiável</span>
          </div>
        </div>
      </div>
    </section>
  );
}
