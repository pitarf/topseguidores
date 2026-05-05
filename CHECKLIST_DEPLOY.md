# 🚀 CHECKLIST DEFINITIVO: Deploy Top Seguidores (VPS)

Siga estes passos exatamente nesta ordem para colocar o site no ar com todos os planos e preços configurados.

---

### Passo 1: No seu Computador (Garantir que tudo está no Git)
Já fizemos isso, mas sempre verifique se enviou as últimas alterações:
```powershell
git add .
git commit -m "preparando para deploy"
git push origin main
```

---

### Passo 2: Na sua VPS (Acessar e Clonar)
Acesse sua VPS via SSH e vá para a pasta de sites:
```bash
cd /var/www
git clone https://github.com/pitarf/topseguidores.git
cd topseguidores
```

---

### Passo 3: Configurar o Ambiente (.env)
Crie o arquivo de configuração e edite com seus dados:
```bash
cp .env.example .env
nano .env
```
**No editor (nano), preencha:**
- `NEXTAUTH_URL`: https://seu-dominio.com
- `RAPID_API_KEY`: Sua chave do RapidAPI
- `PUSHINPAY_TOKEN`: Seu token da PushinPay
- `POSTGRES_PASSWORD`: Crie uma senha forte para o banco

*(Pressione `CTRL+O`, `Enter` e `CTRL+X` para salvar e sair)*

---

### Passo 4: Subir os Containers (Docker)
Inicie o sistema. O Docker vai baixar o Node, o Postgres e configurar tudo sozinho:
```bash
docker compose up -d --build
```
*Aguarde terminar. O site já estará rodando internamente na porta 3010.*

---

### Passo 5: IMPORTANTE - Carregar Planos e Preços
Agora vamos levar os dados (planos/valores) para o banco da VPS usando o Seed:
```bash
docker exec -it topseguidores-app npx prisma db seed
```
**✅ Pronto! Seus planos e preços locais agora estão na VPS.**

---

### Passo 6: Configurar o Domínio (Nginx)
Agora vamos dizer ao servidor que quem acessar seu domínio deve cair no site (porta 3010):
```bash
sudo nano /etc/nginx/conf.d/topseguidores.conf
```
**Cole isto lá (mude 'seu-dominio.com'):**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
**Reinicie o Nginx:**
```bash
sudo systemctl restart nginx
```

---

### Passo 7: Ativar o Cadeado (SSL)
```bash
sudo certbot --nginx -d seu-dominio.com
```

---

## 📋 Comandos de Manutenção (Resumo)
- **Ver se está rodando:** `docker ps`
- **Ver logs de erro:** `docker logs -f topseguidores-app`
- **Atualizar o site:** 
  ```bash
  git pull
  docker compose up -d --build
  ```
