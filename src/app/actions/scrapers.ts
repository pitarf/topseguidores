"use server";

import { prisma } from "@/lib/prisma";

async function getApiKey() {
  const settings = await prisma.systemSetting.findFirst();
  return settings?.rapidApiKey || process.env.RAPID_API_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
}

export async function searchInstagramProfile(username: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();

  try {
    const res = await fetch(`https://instagram360.p.rapidapi.com/userinfo/?username_or_id=${clean}`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "instagram360.p.rapidapi.com"
      },
      signal: AbortSignal.timeout(8000)
    });
    
    console.log(`[Instagram API] Status: ${res.status}`);
    const data = await res.json();
    
    if (!res.ok || data.status === "error") {
      console.error("[Instagram API] Erro:", data);
      return { success: false, error: data.message || "Perfil do Instagram não encontrado" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Instagram Profile Search Error:", error);
    return { success: false, error: "Falha na conexão com Instagram API" };
  }
}

export async function getInstagramFeed(username: string, type: 'reels' | 'posts', cursor?: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();
  const endpoint = type === 'reels' ? 'userreels' : 'userposts';
  
  let url = `https://instagram360.p.rapidapi.com/${endpoint}/?username_or_id=${clean}`;
  if (cursor) url += `&pagination_token=${cursor}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "instagram360.p.rapidapi.com"
      },
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Instagram Feed Error:", error);
    return { success: false, error: "Falha ao carregar mídias" };
  }
}

export async function searchTikTokProfile(username: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();

  try {
    const res = await fetch(`https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${clean}`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "tiktok-api23.p.rapidapi.com"
      },
      signal: AbortSignal.timeout(8000)
    });
    
    console.log(`[TikTok API] Status: ${res.status}`);
    const data = await res.json();

    if (!res.ok || (data.statusCode && data.statusCode !== 0 && data.status_code !== 0)) {
      console.error("[TikTok API] Erro:", data);
      return { success: false, error: data.status_msg || data.message || "Erro na API do TikTok" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("TikTok Profile Search Error:", error);
    return { success: false, error: "Falha na conexão com TikTok API" };
  }
}

export async function getTikTokFeed(secUidOrUsername: string, cursor?: string) {
  const apiKey = await getApiKey();
  const c = cursor || "0";
  
  let url = `https://tiktok-api23.p.rapidapi.com/api/user/posts?secUid=${encodeURIComponent(secUidOrUsername)}&count=12&cursor=${c}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "tiktok-api23.p.rapidapi.com"
      },
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("TikTok Feed Error:", error);
    return { success: false, error: "Falha ao carregar feed do TikTok" };
  }
}
