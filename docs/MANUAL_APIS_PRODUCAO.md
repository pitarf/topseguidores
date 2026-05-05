# 🚀 Guia de Configuração das APIs de Produção

Este documento contém os links e instruções necessários para a contratação das APIs que alimentam as buscas de perfis e postagens do sistema. Para garantir a estabilidade em produção, é necessário que o cliente crie uma conta no **RapidAPI** e assine os planos recomendados abaixo.

---

## 1. Criar Conta no RapidAPI
Caso ainda não possua, acesse [RapidAPI.com](https://rapidapi.com/auth/sign-up) e crie uma conta gratuita.

---

## 2. API para Instagram (Busca de Perfil e Mídias)
Esta API é responsável por carregar a foto do perfil, número de seguidores e as postagens para escolha no checkout.

*   **Link da API**: [Instagram Scraper 21](https://rapidapi.com/premium-apis-oanor/api/instagram-scraper21)
*   **Plano Recomendado**: **PRO ($9.99/mês)**
    *   *Por que este plano?* Ele oferece **30.000 requisições por mês**, o que é excelente para escalar a operação com segurança.
*   **Ação**: Acessar o link, clicar na aba **"Pricing"** e assinar o plano **PRO**.

---

## 3. API para TikTok (Busca de Perfil e Vídeos)
Esta API oferece o melhor custo-benefício do mercado, sendo rápida e ultra estável.

*   **Link da API**: [TikTok API - Fast & Reliable (Mediacrawlers)](https://rapidapi.com/mediacrawlers-mediacrawlers-default/api/tiktok-api-fast-reliable-data-scraper)
*   **Plano Recomendado**: **BASIC ($4.99/mês)**
    *   *Por que este plano?* Ele oferece **2.000 requisições por dia**, o que totaliza **60.000 por mês** por um preço imbatível.
*   **Ação**: Acessar o link, clicar na aba **"Pricing"** e assinar o plano **BASIC**.

---

## 4. Onde encontrar a Chave de API (X-RapidAPI-Key)
Após assinar os planos, a chave será a mesma para ambas as APIs.

1.  Acesse qualquer um dos links acima.
2.  Role a página até a seção de código (Playground).
3.  No painel à direita (Header Parameters), procure por `X-RapidAPI-Key`.
4.  Copie o código alfanumérico longo e envie para o desenvolvedor configurar no servidor.

---

> [!IMPORTANT]
> **Segurança**: Nunca compartilhe sua senha do RapidAPI. O desenvolvedor precisa apenas da **API KEY** para colocar o sistema no ar.
