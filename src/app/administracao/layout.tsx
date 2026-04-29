import { Metadata } from "next";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administração - Viraliza Reels",
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
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Sidebar / Topbar no Mobile */}
        <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/5 bg-[#0a0f1a] p-4 md:p-6 flex flex-col md:relative shrink-0 z-10 shadow-lg md:shadow-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block hidden" />
          
          <div className="mb-4 md:mb-10 md:mt-2 flex justify-between items-center md:block">
            <div>
              <h2 className="text-xl md:text-2xl font-[1000] text-white uppercase tracking-tighter flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary animate-pulse" />
                Admin<span className="text-primary">Panel</span>
              </h2>
              <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 tracking-widest uppercase mt-1">Viraliza Reels System</p>
            </div>
            
            {/* Botão Sair - Mobile */}
            <Link 
              href="/" 
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-zinc-500 font-bold transition-all hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-3 flex-none md:flex-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Link 
              href="/administracao" 
              className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black transition-all hover:bg-primary/20 shadow-[0_0_20px_rgba(255,0,0,0.1)] uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/administracao/settings" 
              className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-3 md:py-4 rounded-xl md:rounded-2xl text-zinc-400 font-bold transition-all hover:bg-white/5 hover:text-white uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <span>Ajustes<span className="hidden md:inline"> (SEO)</span></span>
            </Link>
          </nav>
          
          <div className="hidden md:block pt-6 border-t border-white/5 mt-auto">
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
          <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto pb-20 md:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
