"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckout } from "@/hooks/useCheckout";
import { X, Video, CheckCircle2, Copy, QrCode, ShieldCheck, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function CheckoutModal() {
  const { isOpen, closeCheckout, selectedPlan } = useCheckout();
  const [step, setStep] = useState(1); // 1: Input, 2: Payment
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Reseta o modal ao fechar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setUrl("");
    }
  }, [isOpen]);

  const [pixCode, setPixCode] = useState("");
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState("");

  const handleGeneratePix = async () => {
    if (!url.trim()) {
      toast.error("Por favor, insira o link do seu Reel.");
      return;
    }

    if (!url.includes("instagram.com")) {
      toast.error("O link parece inválido. Use um link do Instagram Reels.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          instagramUrl: url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

      setPixCode(data.pixCode);
      setPixQrCodeBase64(data.pixQrCodeBase64);
      setStep(2);
      toast.success("PIX gerado com sucesso!");

      // Dispara o evento de InitiateCheckout pro Facebook Pixel
      // @ts-ignore
      if (typeof window !== "undefined" && window.fbq) {
        // @ts-ignore
        window.fbq("track", "InitiateCheckout", {
          value: selectedPlan?.price,
          currency: "BRL"
        });
      }

    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    if (!pixCode) return;
    
    // Tenta primeiro o método moderno
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(pixCode)
        .then(() => toast.success("Código PIX copiado!"))
        .catch(() => fallbackCopy(pixCode));
    } else {
      fallbackCopy(pixCode);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success("Código PIX copiado!");
    } catch (err) {
      toast.error("Não foi possível copiar automaticamente.");
    }
    document.body.removeChild(textArea);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh] scrollbar-hide"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <h2 className="text-2xl font-black text-white px-2">Finalizar Compra</h2>
            <button
              onClick={closeCheckout}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                {/* Plano Selecionado */}
                <div className="bg-[#080c16] rounded-2xl p-6 border border-[#20283c] flex items-center justify-between relative overflow-hidden">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{selectedPlan?.name}</span>
                    <h3 className="text-2xl font-black text-white">{selectedPlan?.views} Views</h3>
                  </div>
                  <div className="text-4xl font-[1000] text-primary tracking-tighter">
                    R$ {selectedPlan?.price}
                  </div>
                </div>

                {/* Aviso Perfil Público */}
                <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 text-center animate-pulse">
                  <p className="text-primary font-black text-xs uppercase tracking-tight">
                    ⚠️ PERFIL PRECISA ESTAR PÚBLICO! ⚠️
                  </p>
                </div>

                {/* Input de Link */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-400 ml-1">
                    Link do Reel Instagram
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="https://www.instagram.com/reel/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-[#080c16] border border-[#20283c] focus:border-primary/50 text-white rounded-xl py-4 px-4 outline-none transition-all font-medium placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="space-y-2 ml-1">
                    <p className="text-[11px] text-zinc-500 font-bold flex items-center gap-2">
                       📌 Cole APENAS o link do REEL que deseja turbinar
                    </p>
                    <p className="text-[11px] text-zinc-500 font-bold flex items-center gap-2">
                       ⚠️ Links de stories, perfil ou posts NÃO são aceitos
                    </p>
                    <p className="text-[11px] text-zinc-500 font-bold flex items-center gap-2">
                       🔓 Conta privada não funciona
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePix}
                  disabled={loading}
                  className="w-full py-5 font-black text-white rounded-2xl bg-primary hover:brightness-125 active:scale-95 transition-all shadow-[0_10px_20px_-10px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] uppercase tracking-widest text-sm"
                >
                  {loading ? "GERANDO..." : "GERAR PIX"}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="inline-flex w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 items-center justify-center mb-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-1">Quase lá!</h3>
                  <p className="text-zinc-400 text-xs font-medium max-w-xs mx-auto">
                    Escaneie o QR Code abaixo ou copie o código para finalizar.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-[1.5rem] inline-block mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  {pixQrCodeBase64 ? (
                    <img src={pixQrCodeBase64} alt="QR Code PIX" className="w-40 h-40" />
                  ) : (
                    <QrCode className="w-40 h-40 text-black" />
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={copyPix}
                    className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Copy className="w-6 h-6" /> COPIAR CÓDIGO PIX
                  </button>
                  
                  <button
                    onClick={() => setStep(1)}
                    className="text-zinc-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors block w-full"
                  >
                    VOLTAR E ALTERAR DADOS
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-[10px] text-primary/70 font-bold leading-relaxed">
                  NOSSO SISTEMA É AUTOMÁTICO.<br />
                  VOCÊ RECEBERÁ AS VIEWS ASSIM QUE O PIX FOR CONFIRMADO.
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
