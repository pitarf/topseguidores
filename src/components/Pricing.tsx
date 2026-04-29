"use client";

import { motion } from "framer-motion";
import { Star, Users, Flame, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { CountdownTimer } from "./CountdownTimer";

interface Plan {
  id: string;
  name: string;
  views: string;
  price: string;
  originalPrice?: string;
  popular: boolean;
  badge: string;
  viewers: number;
}

export function Pricing({ initialPlans }: { initialPlans: Plan[] }) {
  const { openCheckout } = useCheckout();
  
  const plans = initialPlans;

  return (
    <section id="precos" className="py-24 bg-[#080c16] relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <CountdownTimer />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="relative flex flex-col items-center"
            >
              {plan.badge && (
                <div className="absolute -top-4 z-10 bg-gradient-to-r from-orange-400 to-red-500 px-4 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 text-white fill-current" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{plan.badge}</span>
                </div>
              )}
              
              <div className="relative group w-full p-px rounded-[1.5rem] transition-all duration-300 hover:scale-[1.02] bg-[#20283c] hover:bg-primary">
                <div className="bg-[#0b111e] rounded-[1.4rem] p-8 flex-1 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                      {plan.name}
                    </span>
                    <Star className="w-4 h-4 text-primary fill-current" />
                  </div>

                  <div className="bg-primary/10 px-4 py-1 rounded-full mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                      Visualizações Reels
                    </span>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-[30px] font-bold text-white tracking-tighter">
                      {plan.views} Views
                    </h3>
                    <p className="text-zinc-500 text-xs font-bold mt-1">Entrega rápida e segura</p>
                  </div>

                  <div className="mb-8 flex items-center justify-center gap-2 text-primary">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold">
                      {(plan.viewers * 100) + (plan.viewers * 17 % 89) + 14} pessoas estão vendo agora
                    </span>
                  </div>

                  <div className="mb-8 space-y-1">
                    <div className="text-white text-[36px] font-[900] tracking-tighter">
                      R$ {plan.price}
                    </div>
                    <div className="text-zinc-500 text-[10px] font-bold">
                      de <span className="line-through">R$ {plan.originalPrice}</span> por <span className="text-primary">R$ {plan.price}</span> - Oferta exclusiva
                    </div>
                  </div>

                  <ul className="mb-10 space-y-4 flex-1 w-full">
                    {[
                      "📌 Cole o link do seu vídeo",
                      "🔓 Vídeo privado não funciona",
                      "⚡ Entrega em até 10 minutos",
                    ].map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-xs font-bold text-zinc-400 text-left">
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-5 font-black text-white rounded-2xl transition-all bg-primary hover:brightness-125 active:scale-95 shadow-[0_10px_20px_-10px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] uppercase tracking-widest text-sm"
                  >
                    COMPRAR AGORA
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
