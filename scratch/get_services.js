async function getServices() {
    const key = "e91215c746796fa3e3f1093b4171f275";
    const url = "https://dukefornecedor.com/api/v2";

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams({
                key: key,
                action: 'services'
            })
        });
        const services = await response.json();
        
        const keywords = ['seguidores brasileiros', 'curtidas brasileiras'];
        
        const filtered = services.filter(s => {
            const name = s.name.toLowerCase();
            const cat = s.category.toLowerCase();
            return keywords.some(k => name.includes(k) || cat.includes(k)) && (name.includes('instagram') || cat.includes('instagram'));
        });

        console.log("ID | CATEGORIA | NOME | PREÇO");
        console.log("------------------------------");
        filtered.forEach(s => {
            console.log(`${s.service} | ${s.category} | ${s.name} | R$ ${s.rate}`);
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

getServices();
