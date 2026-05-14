import { prisma } from "@/lib/prisma";

export async function getSystemSettings() {
  // Se estivermos em fase de build e o banco não estiver disponível, retorna fallback silenciosamente
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  try {
    const settings = await prisma.systemSetting.findFirst();
    
    if (!settings) {
      // Tenta criar padrão, mas se falhar (ex: build), cai no catch
      return await prisma.systemSetting.create({
        data: {
          id: "1",
          siteTitle: "Top Seguidores - Comprar Seguidores e Curtidas",
          siteDescription: "A melhor plataforma para aumentar seu engajamento no Instagram e TikTok de forma rápida e segura.",
          siteKeywords: "comprar seguidores, instagram, tiktok, curtidas, visualizações, engajamento",
        },
      });
    }
    
    return settings;
  } catch (error) {
    // Durante o build, não logamos o erro de conexão para não poluir o console
    if (!isBuildPhase) {
      console.error("Erro ao buscar configurações do sistema:", error);
    }
    
    return {
      id: "fallback",
      siteTitle: "Top Seguidores",
      siteDescription: "A melhor plataforma para comprar seguidores, curtidas e visualizações.",
      siteKeywords: "comprar seguidores, instagram, tiktok, curtidas, visualizações",
      showNotifications: true,
      faviconUrl: null,
      logoUrl: null,
      fbPixelId: null,
      fbApiToken: null,
      whatsappNumber: "",
      updatedAt: new Date(),
    } as any;
  }
}
