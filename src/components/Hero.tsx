"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, ArrowRight, Users } from "lucide-react";
import { useHowItWorks } from "@/hooks/useHowItWorks";

export function Hero() {
  const { openModal } = useHowItWorks();
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-36 lg:pb-32 bg-[#050505]">
      {/* Background Gradients - Efeitos de Profundidade */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] -z-10 opacity-40" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold tracking-wide uppercase border rounded-full border-primary/20 text-primary bg-primary/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Oferta Especial: 60% OFF Hoje
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 text-5xl font-[900] tracking-tighter text-white lg:text-[72px] leading-[1.1]"
          >
            Cresça seu <span className="neon-text-red">Instagram</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12 text-lg lg:text-xl text-zinc-400 font-medium leading-relaxed"
          >
            Aumente suas visualizações de forma <span className="text-primary font-bold">rápida</span>, 
            <span className="text-primary font-bold mx-1">segura</span> e 
            <span className="text-primary font-bold ml-1">confiável</span>.
            <br />
            <span className="block mt-2 text-sm text-zinc-500 font-bold uppercase tracking-widest">
              Mais de <span className="text-white">500 MIL</span> clientes satisfeitos!
            </span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-2xl"
          >
            <a
              href="#precos"
              className="group relative w-full sm:w-auto px-10 py-5 text-lg font-black text-white transition-all rounded-xl btn-primary-gradient hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,0,0,0.6)] hover:brightness-110"
            >
              COMPRAR VISUALIZAÇÕES
            </a>
            <button
              onClick={openModal}
              className="w-full sm:w-auto px-10 py-5 text-lg font-black text-white transition-all rounded-xl border-2 border-primary/40 hover:bg-primary/5 flex items-center justify-center"
            >
              COMO FUNCIONA
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-4 text-zinc-500 font-medium"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm">
              <span className="text-white font-bold">+500k</span> pedidos entregues com sucesso
            </p>
          </motion.div>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 gap-6 mt-24 md:grid-cols-3">
          {[
            {
              icon: <Zap className="w-6 h-6 text-primary fill-primary/20" />,
              title: "Entrega Ninja",
              desc: "Início imediato. Você verá os resultados em segundos após a confirmação.",
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Seguro & Anônimo",
              desc: "Não pedimos sua senha. Processo 100% externo e seguro para sua conta.",
            },
            {
              icon: <Clock className="w-6 h-6 text-primary" />,
              title: "Garantia Vitalícia",
              desc: "Sistema anti-queda. Seus números permanecem sólidos e duradouros.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-8 glass-morphism rounded-[2.5rem] relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {item.icon}
              </div>
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,0,62,0.2)]">
                {item.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
