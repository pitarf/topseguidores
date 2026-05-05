# Manual do Desenvolvedor - Cresce Reels (Top Seguidores)

## Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS (Uso de temas neon/dark premium)
- **Banco de Dados:** PostgreSQL (via Prisma ORM com adapter-pg)
- **Ícones:** Lucide React
- **Animações:** Framer Motion
- **Notificações:** Sonner (Toast Notifications)

## Estrutura de Pastas
- `/src/app/administracao`: Painel de controle (Dashboard, Serviços, Settings)
- `/src/app/actions`: Server Actions para scrapers (Instagram/TikTok)
- `/src/components`: Componentes de UI (Hero, CheckoutModal, etc)
- `/src/services`: Lógica de planos e integração SMM (PerfectPanel)
- `/src/lib/prisma.ts`: Instalação única do Prisma Client com Adapter

## Gestão de Serviços (Dinâmica)
O sistema foi migrado para um modelo **SaaS**, onde os serviços não são mais estáticos no código.
- **Tabela `Plan`**: Armazena plataforma (IG/TikTok), tipo (Seguidores/Likes/Views), preços e `providerServiceId`.
- **Tabela `SystemSetting`**: Centraliza chaves de API (RapidAPI, PushinPay, PerfectPanel).

## Como Rodar Localmente
1. Instale as dependências: `npm install`
2. Configure o `.env` (use o `.env.example`).
3. Suba o banco via Docker ou use uma instância PostgreSQL.
4. Rode as migrations: `powershell -ExecutionPolicy Bypass -Command "npx prisma migrate dev"`
5. Popule os serviços: `powershell -ExecutionPolicy Bypass -Command "npx prisma db seed"`
6. Inicie o servidor: `npm run dev`

## 🚀 Deploy e Produção
Para informações sobre como colocar o sistema em uma VPS (Hostinger/AlmaLinux), consulte o arquivo [DEPLOY_VPS.md](DEPLOY_VPS.md).

## Padrões de Código
- **Segurança**: Nunca expor chaves de API no frontend. Usar `src/app/actions`.
- **Preços**: Armazenados como `Decimal` no Prisma e convertidos para `Number` no frontend.
- **SMM**: A integração com o Duke Fornecedor usa o campo `providerServiceId` do plano selecionado.
