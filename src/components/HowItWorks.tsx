"use client";

import { motion } from "framer-motion";
import { MousePointer2, CreditCard, Rocket } from "lucide-react";

const steps = [
  {
    icon: <MousePointer2 className="w-6 h-6" />,
    title: "1. Escolha o Plano",
    description: "Selecione o pacote que melhor se adapta aos seus objetivos de crescimento.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "2. Pagamento via Pix",
    description: "Realize o pagamento de forma segura e instantânea sem burocracias.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "3. Decole seu Perfil",
    description: "Receba o engajamento em minutos e veja sua autoridade digital crescer.",
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-[#050810] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            Como Funciona?
          </h2>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">
            Três passos simples para você começar a se destacar nas redes sociais hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center p-8 rounded-[2.5rem] border border-white/5 bg-[#0b111e]/50 backdrop-blur-sm group hover:border-primary/20 transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
