# 🚀 Manual de Operação e Deploy na VPS (CyberPanel / AlmaLinux 9)

Este guia contém as instruções exatas para colocar o **Viraliza Reels** no ar em um servidor com CyberPanel/OpenLiteSpeed, como atualizar o sistema com novas funcionalidades e como garantir que seus dados (pedidos e lucros) estejam sempre seguros com backups automatizados a cada 3 horas.

---

## 1. Como colocar no ar (Primeira Vez)

### Preparação do Servidor (Node.js e Docker)
Como o CyberPanel já gerencia a porta 80 e 443 com o OpenLiteSpeed, não usaremos Nginx. Precisamos apenas instalar o Node.js, PM2 e o Docker:
```bash
dnf update -y
dnf install -y git epel-release

# Node.js e PM2
dnf module enable nodejs:20 -y
dnf install -y nodejs
npm install -g pm2

# Docker (Para o Banco de Dados local isolado)
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable --now docker
```

### Baixar o Sistema e Subir o Banco
```bash
cd /home
git clone https://github.com/SEU-USUARIO/viralizareels.git
cd viralizareels

# Subir o Postgres no Docker (porta 5435)
docker compose up -d
```

### Criar o .env e Instalar
Crie o arquivo secreto: `nano .env`
Adicione suas variáveis. **Atenção:** A senha do banco de dados gerado pelo Docker é `postgres` e a porta é `5435`.
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/crescereels?schema=public"
```

Instale as dependências e faça a "Build" (Geração da versão hiper-rápida):
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

### Ligar o Sistema Internamente
```bash
pm2 start npm --name "viralizareels" -- start
pm2 save
pm2 startup
```

### Configurar o Domínio e Proxy Reverso (Via CyberPanel CLI)
```bash
# 1. Cria a estrutura do site no CyberPanel
cyberpanel createWebsite --package Default --owner admin --domain viralizareels.com --email admin@viralizareels.com --php 8.1

# 2. Gera o SSL gratuito (Cadeado Verde)
cyberpanel issueSSL --domainName viralizareels.com

# 3. Adiciona a regra de Proxy Reverso no arquivo .htaccess
echo -e "\nRewriteEngine On\nRewriteRule ^(.*)$ http://127.0.0.1:3005/\$1 [P,L]" >> /home/viralizareels.com/public_html/.htaccess

# 4. Reinicia o servidor Web OpenLiteSpeed
systemctl restart lsws
```

---

## 2. Como ATUALIZAR o código (Futuras Melhorias)

Sempre que você desenvolver algo novo no seu computador e fizer o `git push`, siga esta rotina na VPS para colocar a novidade no ar sem derrubar o site:

```bash
cd /home/viralizareels

# 1. Puxa as novidades do Git
git pull origin main

# 2. Instala se tiver pacotes novos
npm install

# 3. Atualiza o banco de dados (se houver tabelas novas)
npx prisma generate
npx prisma db push

# 4. Reconstrói o site otimizado
npm run build

# 5. Reinicia o sistema sem downtime
pm2 restart viralizareels
```

---

## 3. Sistema de Backup Automatizado (A cada 3 horas)

Se acontecer qualquer catástrofe, você não pode perder seus pedidos. Vamos criar um script que faz backup automático do Postgres e apaga o anterior para não lotar o disco da VPS.

### Passo A: Criar o Script de Backup
```bash
mkdir -p /var/backups/crescereels
nano /root/backup-db.sh
```

Cole o código abaixo:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/crescereels"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Faz o dump direto de dentro do container Docker
docker exec crescereels-db pg_dump -U postgres -d crescereels > "$BACKUP_FILE"

# Verifica se o backup funcionou (se o tamanho do arquivo for maior que 0)
if [ $? -eq 0 ] && [ -s "$BACKUP_FILE" ]; then
    # Mantém apenas o backup mais recente (apaga todos os outros)
    ls -t "$BACKUP_DIR"/db_backup_*.sql | tail -n +2 | xargs -r rm --
    echo "Backup OK em $TIMESTAMP"
else
    # Se falhou, deleta o arquivo quebrado
    echo "Falha no backup em $TIMESTAMP"
    rm -f "$BACKUP_FILE"
fi
```

Dê permissão de execução para o script:
```bash
chmod +x /root/backup-db.sh
```

### Passo B: Agendar o Backup Automático
Execute **este comando de uma única linha** para salvar o agendamento no Crontab automaticamente, sem precisar abrir o editor chato do Linux:

```bash
(crontab -l 2>/dev/null; echo "0 */3 * * * /root/backup-db.sh >> /var/backups/crescereels/backup.log 2>&1") | crontab -
```

Para conferir se foi agendado com sucesso, rode:
```bash
crontab -l
```

Pronto! Seu banco de dados agora está blindado com backups rotativos. 

Para restaurar um backup um dia se precisar, basta rodar:
`cat /var/backups/crescereels/db_backup_DATA.sql | docker exec -i crescereels-db psql -U postgres -d crescereels`
