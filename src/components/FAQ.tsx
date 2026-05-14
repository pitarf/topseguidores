"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "O serviço é seguro para meu perfil?",
    answer: "Sim, absolutamente. Utilizamos métodos orgânicos e seguros que respeitam as diretrizes das principais plataformas. Não solicitamos sua senha e todo o processo é feito de forma externa e protegida."
  },
  {
    question: "Quanto tempo leva para receber os resultados?",
    answer: "O início é quase imediato. A maioria dos pedidos começa a ser processada em menos de 5 minutos após a confirmação do pagamento via Pix."
  },
  {
    question: "Preciso informar minha senha?",
    answer: "Nunca! Jamais solicitaremos sua senha. Precisamos apenas do link do perfil ou da postagem que receberá o engajamento."
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: "Trabalhamos exclusivamente com Pix para garantir a máxima velocidade na entrega e segurança na transação."
  },
  {
    question: "Os seguidores são reais?",
    answer: "Sim, trabalhamos com perfis de alta qualidade para garantir que seu engajamento pareça natural e ajude no crescimento da sua autoridade digital."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-[#030712]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            Dúvidas Frequentes
          </h2>
          <p className="text-zinc-500 font-medium">
            Tudo o que você precisa saber sobre como impulsionar seu perfil.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-white/5 bg-secondary/10 rounded-2xl overflow-hidden transition-all hover:border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <span className="text-white font-bold text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  openIndex === index ? "bg-primary text-white" : "bg-white/5 text-zinc-500"
                }`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4 mx-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
