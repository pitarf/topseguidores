# Guia de Deploy VPS (AlmaLinux - Hostinger) 🚀

Este guia detalha como colocar o sistema **Top Seguidores** em produção na sua VPS AlmaLinux, garantindo que ele coexista com o sistema que já roda na porta 3005.

---

## 1. Preparação do Servidor

Acesse sua VPS via SSH e instale as dependências básicas.

### Instalar Node.js (v20+)
```bash
# Adicionar repositório do Node.js
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verificar versão
node -v
```

### Instalar Git e PM2
```bash
sudo dnf install -y git
sudo npm install -g pm2
```

### Instalar PostgreSQL (Caso ainda não tenha)
```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

# Criar banco de dados e usuário
sudo -u postgres psql
# No terminal do Postgres:
CREATE DATABASE topseguidores;
CREATE USER admin_user WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE topseguidores TO admin_user;
\q
```

---

## 2. Configuração da Aplicação

### Clonar e Instalar
```bash
cd /var/www
# Se o diretório não existir: sudo mkdir -p /var/www && sudo chown $USER:$USER /var/www
git clone https://github.com/pitarf/topseguidores.git
cd topseguidores
npm install
```

### Configurar Variáveis de Ambiente
Crie o arquivo `.env` baseado no seu `.env.example`:
```bash
nano .env
```
**Campos essenciais:**
```env
DATABASE_URL="postgresql://admin_user:sua_senha_forte@localhost:5432/topseguidores?schema=public"
NEXTAUTH_SECRET="gere_um_segredo_aleatorio"
NEXTAUTH_URL="https://seu-dominio.com"

# API Keys (RapidAPI, PushinPay, etc)
RAPID_API_KEY="sua_chave"
PUSHINPAY_TOKEN="seu_token"
```

### Build do Sistema
```bash
# Sincronizar banco de dados
npx prisma db push
npx prisma db seed

# Build para produção
npm run build
```

---

## 3. Deploy via Docker (Recomendado) 🐳

Se preferir rodar via Docker para facilitar a manutenção e isolamento:

### Instalar Docker (Se não tiver)
```bash
sudo dnf install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
```

### Iniciar o Sistema
```bash
# Na raiz do projeto (/var/www/topseguidores)
docker compose up -d --build
```
Isso iniciará o banco na porta **5436** e o app na porta **3010**.

---

## 4. Gerenciamento de Processo (Alternativa: PM2)

Como você já tem algo na porta 3005, vamos rodar este sistema na porta **3010**.

```bash
# Iniciar com PM2 definindo a porta
PORT=3010 pm2 start npm --name "topseguidores" -- start

# Salvar para iniciar automaticamente no reboot
pm2 save
pm2 startup
```

---

## 4. Configuração do Proxy Reverso (Nginx)

Precisamos do Nginx para encaminhar o tráfego do seu domínio para a porta 3010.

### Instalar Nginx
```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

### Criar Configuração do Site
```bash
sudo nano /etc/nginx/conf.d/topseguidores.conf
```

**Cole o seguinte conteúdo (ajustando o domínio):**
```nginx
server {
    listen 80;
    server_name seu-dominio.com; # Altere para seu domínio

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

### Reiniciar Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. SSL (HTTPS) com Certbot

```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## Resumo de Comandos Úteis
- **Ver Logs:** `pm2 logs topseguidores`
- **Reiniciar App:** `pm2 restart topseguidores`
- **Status do Banco:** `npx prisma studio` (localmente via túnel SSH se necessário)

> [!IMPORTANT]
> Lembre-se de liberar as portas **80** e **443** no firewall da Hostinger (Painel de Controle -> VPS -> Firewall).
