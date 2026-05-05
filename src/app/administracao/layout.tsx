import { Metadata } from "next";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SidebarNav } from "./SidebarNav";

export const metadata: Metadata = {
  title: "Administração - Topseguidores",
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
              <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 tracking-widest uppercase mt-1">Topseguidores System</p>
            </div>
            
            {/* Botão Sair - Mobile */}
            <Link 
              href="/" 
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-zinc-500 font-bold transition-all hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>

          <SidebarNav />
          
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
