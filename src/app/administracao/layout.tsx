import { Metadata } from "next";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administração - Cresce Reels",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdministracaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans selection:bg-primary/30">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-[#0a0f1a] p-6 flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="mb-10 mt-2">
            <h2 className="text-2xl font-[1000] text-white uppercase tracking-tighter flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              Admin<span className="text-primary">Panel</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mt-1">Cresce Reels System</p>
          </div>

          <nav className="space-y-3 flex-1">
            <Link 
              href="/administracao" 
              className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black transition-all hover:bg-primary/20 shadow-[0_0_20px_rgba(255,0,0,0.1)] uppercase tracking-wider text-xs"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard (BI)
            </Link>
            
            <Link 
              href="/administracao/settings" 
              className="flex items-center gap-3 px-4 py-4 rounded-2xl text-zinc-400 font-bold transition-all hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
            >
              <Settings className="w-5 h-5" />
              SEO & Branding
            </Link>
          </nav>
          
          <div className="pt-6 border-t border-white/5">
             <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 font-bold transition-all hover:text-red-400 text-xs uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Sair / Voltar ao Site
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#050810]">
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
