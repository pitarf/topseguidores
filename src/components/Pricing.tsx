"use client";

import { motion } from "framer-motion";
import { Check, Star, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  views: string;
  price: string;
  originalPrice?: string;
  popular: boolean;
  badge: string;
}

export function Pricing({ initialPlans }: { initialPlans: Plan[] }) {
  const { openCheckout } = useCheckout();
  
  const getBadgeColor = (badge: string) => {
    const text = badge.toLowerCase();
    if (text.includes('vendido')) return 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]';
    if (text.includes('custo') || text.includes('benefício')) return 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    if (text.includes('desconto')) return 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
    return 'bg-primary shadow-[0_0_20px_rgba(59,130,246,0.5)]';
  };

  return (
    <section id="precos" className="py-8 bg-[#030712]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {initialPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openCheckout(plan)}
              className="group relative cursor-pointer"
            >
              <div className="h-full bg-secondary/40 backdrop-blur-md border-2 border-white/5 rounded-[2.5rem] p-8 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:-translate-y-2">
                
                {/* Badge Superior */}
                {(plan.popular || plan.badge) && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full whitespace-nowrap z-10 ${getBadgeColor(plan.badge)}`}>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="flex items-end gap-1 mb-2">
                    <h3 className="text-6xl font-[1000] text-white tracking-tighter leading-none">
                      {plan.views}
                    </h3>
                  </div>

                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-6">
                    Instagram visualizações em reels
                  </span>

                  <div className="w-full h-px bg-white/5 mb-6" />

                  <div className="space-y-4 w-full mb-8">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-500">Entrega</span>
                      <span className="text-white flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> Imediata</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-500">Reposição</span>
                      <span className="text-white flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary" /> 90 Dias</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-500">Qualidade</span>
                      <span className="text-white">Premium</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-8">
                    {plan.originalPrice && (
                      <span className="text-zinc-500 text-xs font-bold line-through mb-1">R$ {plan.originalPrice}</span>
                    )}
                    <span className="text-4xl font-[1000] text-[#10b981] tracking-tighter">R$ {plan.price}</span>
                  </div>

                  <button className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
                    Comprar Agora
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
