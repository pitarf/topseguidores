# 📘 Manual do Administrador - Viraliza Reels (Top Seguidores)

Bem-vindo ao manual oficial de operação do sistema **Viraliza Reels**. 
Esta plataforma foi desenvolvida para rodar no modelo *Drop Servicing* de forma 100% automatizada, conectando o seu gateway de pagamento (PushinPay) diretamente à sua fonte distribuidora de engajamento (Painel SMM / PerfectPanel / DukeFornecedor).

---

## 1. Acesso ao Sistema e Segurança
O painel administrativo é o centro de comando do seu negócio.

- **URL de Acesso:** `https://viralizareels.com/administracao`
- **Senha Padrão:** Definida no arquivo `.env` (Variável `ADMIN_PASSWORD`).
- **Navegação:** Use a barra lateral para alternar entre Dashboard, Gestão de Serviços e Configurações de API.

---

## 2. Gestão de Serviços e Preços (Novo!)
Diferente das versões anteriores, agora você tem controle total sobre o que vende sem precisar de um programador.

Acesse o menu **Serviços (SMM)** para:
1. **Alterar Preços:** Ajuste o valor de venda de cada pacote (Ex: 1000 seguidores por R$ 26,45).
2. **Definir Quantidades:** Mude a quantidade de engajamento entregue em cada plano.
3. **Configurar o Fornecedor (ID SMM):** Cada plano tem um "ID do Serviço" que deve corresponder ao ID dentro do seu painel SMM (Duke Fornecedor). Se você trocar de fornecedor, basta atualizar esse ID aqui.
4. **Badges Promocionais:** Adicione textos como "MAIS VENDIDO", "OFERTA" ou "30% OFF" para destacar planos específicos no site.

---

## 3. Configurações Globais (SEO & APIs)
No menu **Ajustes (SEO)**, você configura o "cérebro" das integrações:

- **Configurações de SEO:** Título do site, descrição e palavras-chave que aparecem no Google.
- **RapidAPI Key:** Chave necessária para buscar perfis do Instagram e TikTok em tempo real.
- **PushinPay (Gateway):** Token e Token de Webhook para processamento automático de PIX.
- **PerfectPanel (SMM):** URL da API e sua API Key para que o sistema envie os pedidos automaticamente para o fornecedor.
- **Facebook Pixel & CAPI:** IDs de rastreamento para otimizar suas campanhas de anúncios.

---

## 4. Gestão de Pedidos e Leads
A tabela de pedidos agora é mais inteligente:

- **Captura de Leads:** Agora você vê o **Email e WhatsApp** de cada cliente que gerou um PIX. Use esses dados para suporte ou remarketing.
- **Status SMM:** Acompanhe em tempo real se o pedido foi enviado com sucesso para o fornecedor.
- **ID do Pedido (SMM):** Se houver qualquer problema na entrega, use o ID exibido na tabela para abrir um ticket direto com o seu fornecedor.

---

## 5. Fluxo de Venda Automatizado
1. O cliente escolhe um plano no site.
2. O sistema gera o PIX dinâmico via PushinPay.
3. Assim que o cliente paga, a PushinPay avisa o nosso sistema (Webhook).
4. O sistema busca no banco de dados o `providerServiceId` daquele plano.
5. O pedido é enviado instantaneamente para o seu fornecedor SMM.
6. O lucro fica na sua conta PushinPay e o custo é descontado do seu saldo no fornecedor.

---

> **Dica Pro:** Mantenha sempre um saldo reserva no seu fornecedor SMM (Duke Fornecedor) para garantir que os pedidos dos seus clientes nunca fiquem travados por falta de fundos.

Boas Vendas! 🚀
