import { prisma } from "@/lib/prisma";

export async function sendOrderToPerfectPanel(link: string, quantity: number, customServiceId?: string) {
  const settings = await prisma.systemSetting.findFirst();
  
  const apiUrl = settings?.perfectPanelUrl || process.env.PERFECTPANEL_API_URL;
  const apiKey = settings?.perfectPanelKey || process.env.PERFECTPANEL_API_KEY;
  const serviceId = customServiceId || process.env.PERFECTPANEL_SERVICE_ID;

  if (!apiUrl || !apiKey || !serviceId) {
    console.error("❌ PerfectPanel Error: Configurações ausentes no banco ou env.");
    return null;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "add");
    formData.append("service", serviceId);
    formData.append("link", link);
    formData.append("quantity", quantity.toString());

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Adicionado um User-Agent para evitar que firewalls (ex: Cloudflare) bloqueiem a requisição
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CresceReels/1.0",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Erro retornado pela API do PerfectPanel:", data.error);
      return null;
    }

    console.log(`✅ Sucesso! Pedido enviado ao PerfectPanel. ID Retornado: ${data.order}`);
    return data.order?.toString();
  } catch (error) {
    console.error("❌ Falha crítica ao conectar com o PerfectPanel:", error);
    return null;
  }
}
