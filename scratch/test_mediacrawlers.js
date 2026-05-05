async function test() {
  const apiKey = '423d6ba5c1msh41135d64d546cd0p162866jsn7ee91736ccde';
  const username = 'rfpita';
  const host = 'tiktok-api-fast-reliable-data-scraper.p.rapidapi.com';

  try {
    console.log("1. Buscando Perfil (Mediacrawlers)...");
    const pRes = await fetch(`https://${host}/user/${username}`, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': host }
    });
    const pData = await pRes.json();
    console.log("Resposta Perfil:", JSON.stringify(pData, null, 2));

    console.log("\n2. Buscando Feed (Mediacrawlers)...");
    const fRes = await fetch(`https://${host}/user/${username}/feed`, {
      headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': host }
    });
    const fData = await fRes.json();
    console.log("Resposta Feed (Primeiro item):", JSON.stringify(fData[0] || fData.data?.[0], null, 2));

  } catch (e) {
    console.error(e);
  }
}

test();
