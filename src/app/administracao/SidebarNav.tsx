"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Package } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-2 flex-none md:flex-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      <SidebarLink 
        href="/administracao" 
        icon={LayoutDashboard} 
        label="Dashboard" 
        active={pathname === "/administracao"} 
      />
      <SidebarLink 
        href="/administracao/servicos" 
        icon={Package} 
        label="Serviços (SMM)" 
        active={pathname === "/administracao/servicos"} 
      />
      <SidebarLink 
        href="/administracao/settings" 
        icon={Settings} 
        label="Ajustes (SEO)" 
        active={pathname === "/administracao/settings"} 
      />
    </nav>
  );
}

function SidebarLink({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl transition-all uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap border ${
        active 
          ? "bg-primary/10 text-primary border-primary/20 font-black shadow-[0_0_20px_rgba(255,0,0,0.1)]" 
          : "text-zinc-400 font-bold border-transparent hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${active ? "text-primary" : ""}`} />
      <span>{label}</span>
    </Link>
  );
}
