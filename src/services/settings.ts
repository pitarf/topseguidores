import { prisma } from "@/lib/prisma";

export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findFirst();
    
    if (!settings) {
      // Cria uma configuração padrão se não existir
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
    console.error("Erro ao buscar configurações do sistema:", error);
    return {
      id: "fallback",
      siteTitle: "Top Seguidores",
      siteDescription: "A melhor plataforma para comprar seguidores, curtidas e visualizações.",
      siteKeywords: "comprar seguidores, instagram, tiktok, curtidas, visualizações",
      faviconUrl: null,
      logoUrl: null,
      fbPixelId: null,
      fbApiToken: null,
      updatedAt: new Date(),
    } as any;
  }
}
