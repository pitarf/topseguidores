"use client";

import { motion } from "framer-motion";
import { EyeOff, Lock, Clock, Grid, Box, ArrowRight } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";

export function ViralizaFAQ() {
  const { openCheckout } = useCheckout();

  const faqItems = [
    {
      icon: <EyeOff className="w-5 h-5 text-[#3b82f6]" />,
      question: "Alguém consegue saber que eu comprei engajamento?",
      answer: "Ninguém vai ficar sabendo. A compra é 100% anônima.",
    },
    {
      icon: <Lock className="w-5 h-5 text-[#3b82f6]" />,
      question: "Preciso passar minha senha?",
      answer: "Não. Basta informar o perfil ou o link.",
    },
    {
      icon: <Clock className="w-5 h-5 text-[#3b82f6]" />,
      question: "Quando começa a chegar?",
      answer: (
        <>
          Início a partir de 5 minutos, conforme o serviço.
          <br />
          <span className="text-zinc-500 text-xs">O prazo é de início, não de conclusão.</span>
        </>
      ),
    },
    {
      icon: <Grid className="w-5 h-5 text-[#3b82f6]" />,
      question: "Como faço o pagamento?",
      answer: "Pague via Pix e acompanhe a confirmação.",
    },
    {
      icon: <Box className="w-5 h-5 text-[#3b82f6]" />,
      question: "Posso acompanhar a entrega?",
      answer: "Sim. Consulte o andamento do seu pedido.",
    },
  ];

  return (
    <section className="py-12 bg-[#050811] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-xl">
        {/* Cabeçalho */}
        <div className="mb-6">
          <span className="text-[#3b82f6] text-xs font-black tracking-widest uppercase">
            SIMPLES DO INÍCIO AO FIM
          </span>
          <h2 className="text-2xl sm:text-3xl font-[1000] text-white mt-1 tracking-tight">
            Suas dúvidas, respondidas.
          </h2>
        </div>

        {/* Lista de Dúvidas */}
        <div className="space-y-3 mb-6">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#0a101f] border border-[#1e293b] shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#131d33] flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-base font-bold mb-1 leading-snug">
                  {item.question}
                </h3>
                <div className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão de Ação */}
        <div className="flex flex-col items-center">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => openCheckout("instagram")}
            className="w-full py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-[900] text-sm sm:text-base rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            Escolher meu pacote <ArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="mt-3 text-zinc-500 text-xs font-medium text-center">
            Confira os detalhes de cada serviço antes de pedir.
          </p>
        </div>
      </div>
    </section>
  );
}
