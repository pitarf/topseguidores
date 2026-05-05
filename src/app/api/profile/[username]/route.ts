import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username: rawUsername } = await params;
  const username = rawUsername.replace("@", "");

  try {
    // 1. Tentativa via Picuki (Mais fácil de scrapar que o Instagram oficial)
    try {
      const picukiRes = await fetch(`https://www.picuki.com/profile/${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        }
      });
      
      if (picukiRes.ok) {
        const html = await picukiRes.text();
        const profilePic = html.match(/class="profile-avatar-image"\s+src="([^"]+)"/)?.[1];
        const fullName = html.match(/class="profile-name-bottom">([^<]+)</)?.[1]?.trim();
        const followers = html.match(/class="profile-followers-count">([^<]+)</)?.[1]?.trim();

        if (profilePic || fullName) {
          return NextResponse.json({
            success: true,
            profile_pic_url: profilePic,
            full_name: fullName || username,
            username: username,
            followers: followers || "---",
          });
        }
      }
    } catch (e) {
      console.log("Picuki failed, trying AllOrigins...");
    }

    // 2. Bypass via AllOrigins Proxy
    const targetUrl = `https://www.instagram.com/${username}/`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl);

    if (res.ok) {
      const html = await res.text();
      
      // Extração de Imagem
      const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1] || 
                      html.match(/"profile_pic_url":"([^"]+)"/)?.[1]?.replace(/\\u0026/g, '&');
      
      // Extração de Nome
      const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1];
      const fullName = ogTitle?.split(" (@")?.[0]?.trim() || username;

      // Extração de Seguidores
      const ogDesc = html.match(/property="og:description" content="([^"]+)"/)?.[1];
      const followersMatch = ogDesc?.match(/([0-9.,KMB]+)\s+Followers/i) || ogDesc?.match(/([0-9.,KMB]+)\s+seguidores/i);
      const followersCount = followersMatch?.[1] || "---";

      if (ogImage || ogTitle) {
        return NextResponse.json({
          success: true,
          profile_pic_url: ogImage,
          full_name: fullName,
          username: username,
          followers: followersCount,
        });
      }
    }

    return NextResponse.json({ error: "Perfil não encontrado ou bloqueado" }, { status: 404 });

    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}
