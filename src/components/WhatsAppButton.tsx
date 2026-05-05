"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppButton({ number }: { number?: string | null }) {
  if (!number) return null;

  // Limpa o número de qualquer caractere não numérico
  const cleanNumber = number.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=Olá! Vim pelo site Social Fornece e tenho uma dúvida.`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.4)] transition-all group"
      title="Falar no WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-[#0b111e] border border-white/5 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl">
        Dúvidas? Fale conosco!
      </div>

      {/* Ping effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10"></span>
    </motion.a>
  );
}
