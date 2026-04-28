"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(data: {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  faviconUrl: string | null;
}) {
  try {
    const updated = await prisma.systemSetting.update({
      where: { id: "1" },
      data: {
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        siteKeywords: data.siteKeywords,
        faviconUrl: data.faviconUrl,
      },
    });

    revalidatePath("/"); // Limpa o cache da home para atualizar metadados
    revalidatePath("/admin/settings");
    
    return { success: true, data: updated };
  } catch (error) {
    console.error("Falha ao atualizar configurações:", error);
    return { success: false, error: "Erro ao salvar no banco de dados." };
  }
}
