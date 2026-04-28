"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Por favor, digite a senha.");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        toast.success("Acesso liberado!");
        window.location.href = "/administracao";
      } else {
        const data = await res.json();
        toast.error(data.error || "Senha incorreta. Tente novamente.");
        setPassword("");
      }
    } catch (err) {
      toast.error("Erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
         
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Painel Admin</h1>
            <p className="text-zinc-500 text-xs font-bold mt-2">Área de acesso restrito</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password"
                placeholder="Digite a senha..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors text-center font-black tracking-widest text-lg"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:brightness-125 text-white font-black py-5 rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_10px_20px_-10px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]"
            >
              {loading ? "VALIDANDO..." : "ENTRAR NO SISTEMA"}
            </button>
         </form>
         
         <div className="mt-8 text-center">
            <a href="/" className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-white transition-colors">
              &larr; Voltar para o site
            </a>
         </div>
      </div>
    </div>
  );
}
