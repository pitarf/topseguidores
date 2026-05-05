# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [0.3.0] - 2026-05-05
### Adicionado
- **Plataforma Dinâmica (SaaS)**: Todas as chaves de API (`RapidAPI`, `PushinPay`, `PerfectPanel`) agora são configuráveis via banco de dados (`SystemSetting`).
- **Gestão de Serviços**: Nova página administrativa `/administracao/servicos` para gerenciar planos de Instagram e TikTok.
- **Sincronização com SMM**: Adicionado campo `providerServiceId` nos planos para automação instantânea com o Duke Fornecedor (PerfectPanel).
- **Checkout Dinâmico**: O modal de compra agora busca pacotes diretamente do banco de dados, permitindo promoções e ajustes de preços em tempo real.
- **Captura de Contatos**: Registro obrigatório de Email e WhatsApp do cliente em cada pedido para formação de base de CRM.

### Alterado
- **Segurança**: Migração de todas as chamadas de API de scraping para **Server Actions**, ocultando completamente as chaves do cliente.
- **Integração SMM**: Webhooks e lógica de entrega agora utilizam configurações centralizadas no banco.
- **Cabeçalho Admin**: Adicionada barra de navegação rápida entre Dashboard, Serviços e Configurações.

## [0.2.0] - 2026-05-04
### Adicionado
- Integração robusta com a **RapidAPI Instagram Scraper Stable API**.
- Fluxo de Checkout com seleção dinâmica de Reels e Postagens.
- Galeria de mídias real do Instagram com thumbnails e contadores de engajamento (weserv.nl para bypass de CORS).
- Mock de dados de planos para o fluxo de checkout.

### Corrigido
- Erro de sintaxe "Return statement is not allowed here" no `CheckoutModal.tsx`.
- Erro de regras de Hooks do React (Early return antes dos hooks).
- Mapeamento de dados da API para lidar com a estrutura `node.media` (HikerAPI -> RapidAPI).

## [0.1.1] - 2026-04-10
### Adicionado
- Sistema de SEO Dinâmico (Prisma + generateMetadata).
- Painel Administrativo básico (`/admin/settings`) para gestão de Branding.
- Proteção de robôs (`noindex`) para área administrativa.
- Configuração de `robots.txt` e `sitemap.xml`.

## [0.1.0] - 2026-04-10
### Adicionado
- Projeto inicializado com Next.js 15, Tailwind CSS e TypeScript.
- Configuração básica de documentos (CHANGELOG, MANUAL_DEV, MANUAL_USER).
- Instalação de dependências: Prisma, Lucide React, Sonner, Framer Motion.
- Planejamento de Roadmap em `documents/task.md`.
