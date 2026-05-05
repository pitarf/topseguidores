async function test() {
  const apiKey = '423d6ba5c1msh41135d64d546cd0p162866jsn7ee91736ccde';
  const username = 'rfpita';

  try {
    console.log("1. Buscando ID...");
    const sRes = await fetch(`https://tiktok-all-in-one.p.rapidapi.com/search/user?query=${username}`, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'tiktok-all-in-one.p.rapidapi.com' }
    });
    const sData = await sRes.json();
    const found = sData.data?.find(u => u.unique_id.toLowerCase() === username.toLowerCase()) || sData.data?.[0];

    if (!found) return console.log("Usuário não encontrado na busca");
    console.log(`ID encontrado: ${found.uid}`);

    console.log("2. Buscando Info...");
    const iRes = await fetch(`https://tiktok-all-in-one.p.rapidapi.com/user?id=${found.uid}`, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'tiktok-all-in-one.p.rapidapi.com' }
    });
    const iData = await iRes.json();
    console.log(`Username: ${iData.data?.unique_id}, Seguidores: ${iData.data?.followers_count}`);

    console.log("3. Buscando Vídeos...");
    const vRes = await fetch(`https://tiktok-all-in-one.p.rapidapi.com/user/videos?id=${found.uid}&count=5`, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'tiktok-all-in-one.p.rapidapi.com' }
    });
    const vData = await vRes.json();
    const list = vData.data?.videos || vData.data || [];
    console.log(`Vídeos encontrados: ${list.length}`);
    if (list.length > 0) console.log(`Primeiro vídeo ID: ${list[0].video_id}`);

  } catch (e) {
    console.error(e);
  }
}

test();
