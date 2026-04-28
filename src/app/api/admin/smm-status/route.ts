import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderIds } = await req.json();
    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json({});
    }

    const apiUrl = process.env.PERFECTPANEL_API_URL;
    const apiKey = process.env.PERFECTPANEL_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json({ error: "Credenciais do PerfectPanel ausentes" });
    }

    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "status");
    formData.append("orders", orderIds.join(","));

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CresceReels/1.0"
      },
      body: formData.toString()
    });

    const data = await res.json();
    
    // O PerfectPanel retorna um objeto com os IDs dos pedidos como chaves:
    // { "123": { "status": "Pending", "start_count": "100", "remains": "50" } }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Erro ao buscar status no SMM:", e);
    return NextResponse.json({}, { status: 500 });
  }
}
