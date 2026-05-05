# Guia de Deploy VPS (Docker) - Top Seguidores 🐳

Este guia foca na implantação profissional via **Docker**, garantindo isolamento total, persistência de dados e facilidade de atualização.

---

## 1. Preparação do Servidor (Instalar Docker)

Acesse sua VPS via SSH e instale o motor do Docker.

```bash
# Instalar utilitários e repositório
sudo dnf install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Instalar Docker e Docker Compose
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar
sudo systemctl enable --now docker
```

---

## 2. Configuração da Aplicação

### Clonar o Projeto
```bash
cd /var/www
git clone https://github.com/pitarf/topseguidores.git
cd topseguidores
```

### Configurar Variáveis de Ambiente
Crie o arquivo `.env` para que o Docker possa ler as configurações:
```bash
nano .env
```
**Campos obrigatórios:**
```env
# Banco de Dados (Use os mesmos valores do docker-compose.yml)
DATABASE_URL="postgresql://admin_user:sua_senha_forte@postgres-db:5432/topseguidores?schema=public"

# Auth e Segurança
NEXTAUTH_SECRET="gere_um_segredo_aleatorio"
NEXTAUTH_URL="https://seu-dominio.com"

# Integrações
RAPID_API_KEY="sua_chave_aqui"
PUSHINPAY_TOKEN="seu_token_aqui"
PUSHINPAY_WEBHOOK_TOKEN="seu_token_webhook"
```

---

## 3. Subir o Sistema (Container)

Agora basta subir os containers de Banco de Dados e Aplicação. O Docker cuidará de tudo (incluindo o Node.js interno).

```bash
# Iniciar em modo background e compilar a imagem
docker compose up -d --build
```

> **Nota:** O sistema estará rodando internamente na porta **3010**. O banco de dados estará na porta **5436**.

---

## 4. Proxy Reverso (Nginx)

Como você já tem outros sistemas, o Nginx servirá como o "maestro", enviando o tráfego do domínio para o container correto.

### Configurar Site
```bash
sudo nano /etc/nginx/conf.d/topseguidores.conf
```

**Conteúdo:**
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

## 5. SSL e Firewall

### Ativar HTTPS
```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### Abrir Portas no Firewall
Certifique-se de que as portas **80** (HTTP) e **443** (HTTPS) estão abertas no painel da Hostinger.

---

## 🔄 Como Atualizar o Sistema
Sempre que fizer alterações no GitHub:
```bash
git pull
docker compose up -d --build
```
O Docker atualizará apenas o que mudou, mantendo seus dados salvos no volume configurado.
