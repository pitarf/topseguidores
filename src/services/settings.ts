import { prisma } from "@/lib/prisma";

export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSetting.findFirst();
    
    if (!settings) {
      // Cria uma configuração padrão se não existir
      return await prisma.systemSetting.create({
        data: {
          id: "1",
          siteTitle: "Cresce Reels - Comprar Visualizações Instagram",
          siteDescription: "Aumente seu engajamento no Reels de forma rápida e segura.",
          siteKeywords: "comprar visualizações, instagram reels, engajamento, redes sociais",
        },
      });
    }
    
    return settings;
  } catch (error) {
    console.error("Erro ao buscar configurações do sistema:", error);
    return {
      siteTitle: "Cresce Reels",
      siteDescription: "Impulsione seu Instagram",
      siteKeywords: "instagram, reels, views",
      faviconUrl: null,
    };
  }
}
