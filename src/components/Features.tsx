"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, Users } from "lucide-react";

export function Features() {
  return (
    <section className="relative overflow-hidden py-16 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Features Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-7xl mx-auto">
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
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-8 glass-morphism rounded-[2.5rem] relative group overflow-hidden border border-white/5 bg-white/[0.02]"
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
