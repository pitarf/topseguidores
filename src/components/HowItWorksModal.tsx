"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Clapperboard, LockOpen, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black text-white tracking-tight">Como Funciona</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-8">
              {/* Item 1 */}
              <div className="p-5 rounded-2xl bg-[#1a0a0a]/50 border border-primary/20 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Clapperboard className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 leading-none pt-1">Apenas REELS</h3>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Nosso serviço funciona <span className="text-primary font-black uppercase">SOMENTE para Reels</span>. Stories, posts e perfis não são aceitos.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-5 rounded-2xl bg-[#1a0a0a]/50 border border-primary/20 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
                  <LockOpen className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 leading-none pt-1">Perfil Público</h3>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Sua conta deve estar <span className="text-primary font-black">pública</span> para receber as visualizações. Contas privadas não funcionam.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-5 rounded-2xl bg-[#1a0a0a]/50 border border-primary/20 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 leading-none pt-1">Entrega Rápida</h3>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Após o pagamento, as views começam a subir em <span className="text-primary font-black">até 20 minutos</span>!
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className="w-full py-5 bg-primary text-white font-black text-lg rounded-2xl hover:brightness-125 transition-all shadow-[0_0_30px_rgba(255,0,0,0.4)] uppercase tracking-wider active:scale-95"
            >
              ENTENDI!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
