"use client";

import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { image: "/testimonial1.png" },
  { image: "/testimonial2.png" },
  { image: "/testimonial3.png" },
  { image: "/testimonial1.png" }, // Duplicado para preencher a quarta coluna como na ref
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 py-1.5 px-4 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Star className="w-3 h-3 fill-current" /> Depoimentos Reais
          </div>
          <h2 className="text-4xl md:text-6xl font-[1000] text-white mb-4 tracking-tighter">
            Quem usa, <span className="text-primary">recomenda</span>
          </h2>
          <p className="text-zinc-500 font-medium text-sm md:text-lg">
            Confira o que nossos clientes estão falando sobre nós
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto group">
          {/* Navegação */}
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/50 border border-white/5 flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary/50 border border-white/5 flex items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-2xl bg-secondary/20 backdrop-blur-sm"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img 
                    src={t.image} 
                    alt="Depoimento WhatsApp" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/50 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
