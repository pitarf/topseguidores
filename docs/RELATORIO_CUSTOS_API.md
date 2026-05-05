# 📈 Relatório de Viabilidade Técnica e Custos - Integração Instagram

Este documento detalha os custos operacionais da infraestrutura de busca e validação de perfis do Instagram via API para o sistema SocialFornece.

## 1. Estrutura de Custos (RapidAPI)
A solução utiliza a **Instagram Scraper Stable API**, uma das mais resilientes do mercado. O custo é baseado em um modelo de assinatura mensal com cotas de requisições.

### Planos e Preços
| Plano | Requisições/Mês | Preço Mensal | Custo Unitário (Aprox.) |
| :--- | :--- | :--- | :--- |
| **Basic** | 20 | Grátis | $ 0,00 |
| **Pro (Recomendado)** | 50.000 | $ 28,99 | $ 0,00058 |
| **Ultra** | 200.000 | $ 59,99 | $ 0,00030 |
| **Mega** | 1.000.000 | $ 209.99 | $ 0,00021 |

*Valores em Dólar Americano (USD). Conversão sugerida: US$ 1,00 ≈ R$ 5,00.*

---

## 2. Consumo por Cliente (Fluxo de Venda)
Cada ação do cliente no checkout consome uma quantidade específica de créditos da API:

*   **Validação de Perfil + Exibição de Posts:** 1 a 2 requisições.
*   **Carregamento de Mais Publicações (Opcional):** 1 requisição por clique em "Ver Mais".

**Estimativa de Custo Real:**
No plano **Pro**, cada validação completa de cliente custa aproximadamente **R$ 0,006** (menos de 1 centavo). 

> **Exemplo:** Com US$ 28,99 (aprox. R$ 145,00), o sistema suporta até **50.000 buscas** mensais.

---

## 3. Estratégias de Otimização Aplicadas
Para garantir o melhor custo-benefício, implementamos as seguintes técnicas:
1.  **Caching de Imagens:** Utilizamos proxies de imagem (weserv.nl) para evitar requisições repetidas de thumbnails.
2.  **Paginação sob Demanda:** O sistema só consome créditos extras se o usuário realmente solicitar "Ver mais".
3.  **Arquitetura de Chamada Única (Em Implementação):** Estamos migrando para endpoints combinados que trazem dados do perfil e mídias em uma única requisição, reduzindo o custo fixo inicial em 50%.

## 4. Conclusão
A integração via RapidAPI é a opção mais estável para evitar bloqueios do Instagram. O custo operacional por venda é insignificante perante a margem de lucro dos serviços de engajamento, tornando o modelo altamente escalável.

---
*Relatório gerado em 04/05/2026 pela equipe técnica SocialFornece.*
