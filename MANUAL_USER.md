# 📘 Manual do Administrador - Cresce Reels

Bem-vindo ao manual oficial de operação do sistema **Cresce Reels**. 
Esta plataforma foi desenvolvida para rodar no modelo *Drop Servicing* de forma 100% automatizada, conectando o seu gateway de pagamento (PushinPay) diretamente à sua fonte distribuidora de engajamento (Painel SMM / PerfectPanel).

Neste manual, você aprenderá como operar o painel administrativo e gerenciar as configurações do site.

---

## 1. Acesso ao Sistema
Para garantir a segurança financeira do negócio, o painel é protegido e não possui link direto na página de vendas.

- **URL de Acesso:** `SEU_SITE.com/administracao/login`
- **Senha Padrão:** A senha de acesso está configurada no servidor dentro do arquivo `.env` (Variável `ADMIN_PASSWORD`).
- **Segurança:** O acesso gera um *Cookie Seguro* no seu navegador, mantendo você logado por 7 dias ou até você clicar em "Sair".

---

## 2. Dashboard e Métricas (Insights)
Ao entrar, você se depara com o Dashboard estilo Power BI. Ele foi desenhado para te dar o pulso do negócio em milissegundos.

- **Faturamento (Hoje, Semana, Mês, Ano):** Somatório de todos os pedidos que o status do PIX foi confirmado (`SUCCESS`).
- **Gráfico de Receita:** Mostra o desempenho de conversão em Reais (R$) dos últimos 7 dias.
- **Views Entregues:** Total absoluto de visualizações já vendidas e injetadas no funil do SMM.

---

## 3. Gestão e Histórico de Pedidos
A tabela de pedidos é o "coração" da sua operação. Ela não é apenas um registro, ela está **conectada ao vivo** ao Duke Fornecedor (ou outro painel SMM configurado).

### Entendendo os Filtros
Os botões no topo da tabela funcionam exatamente como no seu Painel SMM:
- **Tudo:** Mostra todos os registros.
- **Pendente:** Pedidos que o cliente gerou o PIX mas ainda não pagou OU pedidos pagos que acabaram de entrar na fila do SMM.
- **Em progresso / Processando:** O SMM já começou a injetar as views no link do cliente.
- **Concluído:** A entrega foi 100% finalizada pelo fornecedor.
- **Parcial / Cancelado:** Houve algum problema na entrega (perfil trancado, link apagado, etc). O SMM devolveu parte do seu saldo.

### Como a Tabela Funciona?
1. **Status SMM (A Mágica):** A cada 30 segundos, nosso sistema pergunta secretamente para o seu fornecedor: *"Como estão as entregas?"*. Ele atualiza a sua tabela sem que você precise apertar F5.
2. **Coluna "ID Local" vs "ID SMM":** 
   - *ID Local* é o recibo no seu banco de dados. 
   - *ID SMM* (em azul) é o comprovante do pedido lá no seu fornecedor (Ex: 859302). Se um cliente reclamar, é ESSE código que você vai pesquisar lá no Duke Fornecedor para abrir um ticket.
3. **Contagem Inicial & Restam:** Mostra quantas views o cliente já tinha antes da compra e quantas faltam cair, atualizado em tempo real pelo servidor SMM.

---

## 4. Configurações de Marketing (SEO & Tracking)
Acessando o menu lateral **SEO & Branding** (`/administracao/settings`), você controla o "cérebro" das suas vendas.

### 4.1. Branding e Otimização para o Google (SEO)
- **Título do Site:** É a frase que aparece na aba do navegador e no título do Google.
- **Descrição:** O textinho que aparece embaixo do link quando alguém pesquisa no Google ou quando você envia o link no WhatsApp.
- **Palavras-chave:** Termos ocultos lidos pelo robô do Google para ranquear seu site.

### 4.2. Facebook Ads (Pixel e CAPI)
Nosso sistema possui o rastreamento mais avançado do mercado, evitando perdas de dados pelo AdBlock (Bloqueador de Anúncios) dos usuários (iOS 14+).

1. **Pixel ID:** Cole os números do seu Pixel aqui. 
   - *O que ele faz?* Ele dispara o evento de `PageView` a cada visita e o evento de `InitiateCheckout` (Início de Finalização de Compra) no exato segundo em que o cliente aperta "Gerar PIX".

2. **Conversions API Token (CAPI):** O Token gigante gerado no Gerenciador de Eventos da Meta.
   - *O que ele faz?* O evento de `Purchase` (Compra) **NÃO** é disparado pelo navegador do cliente. Ele é disparado pelo nosso Servidor (Backend).
   - Quando o PIX cai, nosso servidor pega o valor (Ex: R$ 24,90), abre uma conexão segura com o servidor do Mark Zuckerberg e avisa: *"Compra realizada"*. Precisão de 100%.

---

## 5. Como funciona a Automação? (O Fluxo de Venda)
Se você tem dúvidas de como a máquina roda de ponta a ponta enquanto você dorme, aqui está:

1. Cliente entra no `Cresce Reels`.
2. Cola o link do Instagram e clica em **Gerar PIX**.
3. A nossa API chama a **PushinPay** e cria o QR Code. O status no painel fica `Aguardando PIX`.
4. O cliente escaneia e paga no app do banco dele.
5. Em questão de milissegundos, a PushinPay manda um "Aviso/Webhook" para a nossa API avisando que a grana caiu.
6. A nossa API olha no `.env`, pega sua chave da PerfectPanel e manda a ordem de serviço oculta para lá (ID 379), gastando centavos do seu saldo e guardando o lucro.
7. Nossa API salva o `ID SMM`, dispara o evento de Compra (CAPI) pro Facebook e atualiza o seu Painel Admin para `Concluído`.

Tudo isso acontece em **menos de 2 segundos**. 

---

### Dicas de Ouro
* **Saldo no SMM:** Sempre deixe saldo (R$ 50, R$ 100) pré-carregado no seu painel SMM (Duke Fornecedor). Se o cliente comprar aqui e você não tiver saldo lá, o pedido vai falhar ("Erro SMM") e você terá que refazer a compra manualmente para o cliente.
* **Segurança:** Nunca compartilhe a URL do seu painel e não coloque senhas fracas.
* **Perfil Público:** O sistema aceita qualquer link, mas se a conta do cliente estiver Privada no Instagram, o SMM vai automaticamente cancelar a ordem e reembolsar o seu saldo. Você verá isso na tabela como "Cancelado".

Boas vendas! 🚀
