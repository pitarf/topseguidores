import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Aqui poderíamos ter um sidebar ou navbar administrativo futuramente */}
      <div className="flex">
        <aside className="w-64 border-r border-white/10 min-h-screen p-6">
          <h2 className="text-xl font-bold mb-8 text-primary uppercase tracking-tighter">Painel Admin</h2>
          <nav className="space-y-2">
            <a href="/admin/settings" className="block px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
              Configurações SEO
            </a>
            {/* Outros links do dashboard aqui */}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
