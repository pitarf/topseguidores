"use server";

import { prisma } from "@/lib/prisma";

async function getApiKey() {
  const settings = await prisma.systemSetting.findFirst();
  return settings?.rapidApiKey || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
}

export async function searchInstagramProfile(username: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();

  try {
    const res = await fetch(`https://instagram-scraper21.p.rapidapi.com/api/v1/info?id_or_username=${clean}`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "instagram-scraper21.p.rapidapi.com"
      }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Instagram Profile Search Error:", error);
    return { success: false, error: "Falha na busca do Instagram" };
  }
}

export async function getInstagramFeed(username: string, type: 'reels' | 'posts', cursor?: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();
  const endpoint = type === 'reels' ? 'reels' : 'posts';
  const param = type === 'reels' ? 'id_or_username' : 'username';
  
  let url = `https://instagram-scraper21.p.rapidapi.com/api/v1/${endpoint}?${param}=${clean}&limit=12`;
  if (cursor) url += `&cursor=${cursor}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "instagram-scraper21.p.rapidapi.com"
      }
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
    const res = await fetch(`https://tiktok-api-fast-reliable-data-scraper.p.rapidapi.com/user/${clean}`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "tiktok-api-fast-reliable-data-scraper.p.rapidapi.com"
      }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("TikTok Profile Search Error:", error);
    return { success: false, error: "Falha na busca do TikTok" };
  }
}

export async function getTikTokFeed(username: string, cursor?: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();
  
  let url = `https://tiktok-api-fast-reliable-data-scraper.p.rapidapi.com/user/${clean}/feed`;
  if (cursor) url += `?cursor=${cursor}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "tiktok-api-fast-reliable-data-scraper.p.rapidapi.com"
      }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("TikTok Feed Error:", error);
    return { success: false, error: "Falha ao carregar feed do TikTok" };
  }
}
