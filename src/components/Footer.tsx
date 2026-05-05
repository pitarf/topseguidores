"use client";

import { Instagram, Smartphone, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-24 bg-[#030712] border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Serviços</h4>
            <ul className="space-y-4">
              <li>
                <a href="#precos" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">Instagram</a>
              </li>
              <li>
                <a href="#precos" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">TikTok</a>
              </li>
              <li>
                <a href="#precos" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">YouTube</a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Páginas</h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">Início</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">Rastrear Pedido</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">Termos de uso</a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors font-bold text-sm">Política de privacidade</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">
            © 2026 TOPSEGUIDORES. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mb-8 text-zinc-700">
            <Instagram className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            <Smartphone className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
          </div>
          <p className="text-zinc-800 text-[9px] font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            O TOPSEGUIDORES É UMA PLATAFORMA INDEPENDENTE E NÃO POSSUI VÍNCULO DIRETO COM INSTAGRAM, TIKTOK, YOUTUBE OU META PLATFORMS. TODOS OS NOMES E MARCAS SÃO PROPRIEDADE DE SEUS RESPECTIVOS DONOS.
          </p>
        </div>
      </div>
    </footer>
  );
}
