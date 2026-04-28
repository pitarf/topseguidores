# Manual do Desenvolvedor - Cresce Reels

## Stack Tecnológica
- **Framework:** Next.js (App Router)
- **Estilização:** Tailwind CSS (Uso de temas neon/dark)
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Ícones:** Lucide React
- **Animações:** Framer Motion
- **Notificações:** Sonner (Toast)

## Estrutura de Pastas
- `/src/components`: Componentes reutilizáveis (UI)
- `/src/services`: Lógica de integração com APIs e banco
- `/src/hooks`: Hooks customizados
- `/src/lib`: Configurações de bibliotecas (Prisma, etc)
- `/src/utils`: Funções utilitárias

## Como Rodar Localmente
1. Instale as dependências: `npm install`
2. Configure o `.env` (use o `.env.example` como base).
3. Suba o banco via Docker: `docker-compose up -d`
4. Rode as migrations: `npx prisma migrate dev`
5. Inicie o servidor: `npm run dev`

## Padrões de Código
- **Idioma:** Logs e Documentação em PT-BR.
- **Transações:** Operações de saldo/compras devem usar `prisma.$transaction`.
- **SEO:** Metadados dinâmicos via `generateMetadata` do Next.js.
