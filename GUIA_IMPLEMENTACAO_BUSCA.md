# Guia de Implementação: Busca de Perfil e Seleção de Reels (Premium)

Este documento contém o código exato para implementar a busca de perfil e seleção de Reels do Instagram.

---

## 1. Backend: Server Action (`scrapers.ts`)
Copie e cole este código no seu arquivo de ações do servidor. Ele lida com a autenticação e a limpeza do nome de usuário.

```typescript
"use server";

// Função para pegar a chave da API (Ajuste conforme seu banco de dados ou .env)
async function getApiKey() {
  // Exemplo buscando do .env ou de uma tabela de configurações
  return process.env.RAPID_API_KEY || "";
}

// 1. Busca Informações do Perfil (Avatar, Seguidores)
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
    
    if (!res.ok) {
      return { success: false, error: data.message || "Perfil não encontrado" };
    }

    return { 
      success: true, 
      data: {
        username: data.data.username,
        profile_pic_url: data.data.profile_pic_url,
        followers: data.data.follower_count
      }
    };
  } catch (error) {
    return { success: false, error: "Falha na conexão com Instagram API" };
  }
}

// 2. Busca o Feed de REELS do Perfil
export async function getInstagramReels(username: string, cursor?: string) {
  const clean = username.replace("@", "").split("/").pop()?.replace("?", "").trim() || "";
  const apiKey = await getApiKey();
  
  let url = `https://instagram-scraper21.p.rapidapi.com/api/v1/reels?id_or_username=${clean}&limit=12`;
  if (cursor) url += `&cursor=${cursor}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "instagram-scraper21.p.rapidapi.com"
      }
    });
    const data = await res.json();
    
    // Mapeia os dados para um formato fácil de usar no frontend
    const reels = data.data.items.map((item: any) => ({
      id: item.id,
      code: item.code,
      url: item.thumbnail_url,
      views: item.play_count,
      link: `https://www.instagram.com/reels/${item.code}/`
    }));

    return { 
      success: true, 
      data: reels,
      nextCursor: data.data.next_cursor
    };
  } catch (error) {
    return { success: false, error: "Falha ao carregar Reels" };
  }
}
```

---

## 2. Frontend: Lógica de Busca e Seleção
Use esta lógica dentro do seu componente de Modal ou Checkout.

### Estados necessários:
```typescript
const [username, setUsername] = useState("");
const [profileData, setProfileData] = useState<any>(null);
const [reels, setReels] = useState<any[]>([]);
const [selectedReel, setSelectedReel] = useState<any>(null);
const [loading, setLoading] = useState(false);
```

### Função de Busca:
```typescript
const handleSearch = async () => {
  setLoading(true);
  const result = await searchInstagramProfile(username);
  
  if (result.success) {
    setProfileData(result.data);
    // Após achar o perfil, busca os Reels automaticamente
    const reelsResult = await getInstagramReels(username);
    if (reelsResult.success) {
      setReels(reelsResult.data);
      setStep(2); // Muda para o passo de seleção
    }
  } else {
    toast.error("Perfil não encontrado!");
  }
  setLoading(false);
};
```

### Componente de Grid (Tailwind):
```tsx
<div className="grid grid-cols-3 gap-2">
  {reels.map((reel) => (
    <button 
      key={reel.id}
      onClick={() => setSelectedReel(reel)}
      className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${
        selectedReel?.id === reel.id ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "border-transparent"
      }`}
    >
      {/* Proxy images.weserv.nl é essencial para carregar as fotos do Instagram */}
      <img 
        src={`https://images.weserv.nl/?url=${encodeURIComponent(reel.url)}&w=300&h=533&fit=cover`} 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[8px] bg-black/60 px-1 rounded">
        <Play className="w-2 h-2 fill-current" /> {reel.views}
      </div>
    </button>
  ))}
</div>
```

---

## 3. Prompt Final para a IA Desenvolvedora
"Implemente a busca de perfil e seleção de Reels usando os códigos acima. O fluxo deve ser:
1. Usuário digita o @nome.
2. O sistema busca o perfil e exibe a foto e seguidores.
3. Em seguida, carrega as miniaturas dos Reels em um Grid de 3 colunas.
4. O usuário clica no Reels desejado (destaque em Vermelho Neon) e confirma.
5. Use o proxy `images.weserv.nl` em todas as imagens do Instagram."
