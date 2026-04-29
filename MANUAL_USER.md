# 📘 Manual do Administrador - Viraliza Reels

Bem-vindo ao manual oficial de operação do sistema **Viraliza Reels**. 
Esta plataforma foi desenvolvida para rodar no modelo *Drop Servicing* de forma 100% automatizada, conectando o seu gateway de pagamento (PushinPay) diretamente à sua fonte distribuidora de engajamento (Painel SMM / PerfectPanel / DukeFornecedor).

Neste manual, você aprenderá como operar a sua máquina de vendas, gerenciar as configurações do site e lidar com imprevistos.

---

## 1. Acesso ao Sistema e Segurança
Para garantir a segurança financeira do negócio, o painel é protegido e não possui link direto na página de vendas.

- **URL de Acesso:** `https://viralizareels.com/administracao/login`
- **Senha Padrão:** A senha de acesso está configurada direto no servidor da sua VPS dentro do arquivo `.env` (Variável `ADMIN_PASSWORD`).
- **Segurança:** O acesso gera um *Cookie Seguro* no seu navegador. Evite acessar o painel em computadores públicos.

---

## 2. Dashboard e Visão Geral (Insights)
Ao entrar, você se depara com o Dashboard analítico. Ele foi desenhado para te dar o pulso do negócio em milissegundos.

- **Faturamento (Hoje, Semana, Mês, Ano):** Somatório de todos os pedidos cujo PIX foi confirmado (Status `SUCCESS`).
- **Gráfico de Receita:** Mostra o desempenho em Reais (R$) dos últimos 7 dias.
- **Views Entregues:** Total absoluto de visualizações já faturadas e injetadas no painel do SMM.

---

## 3. Gestão e Histórico de Pedidos
A tabela de pedidos é o "coração" da sua operação. Ela não é um registro estático, ela está **conectada ao vivo** ao DukeFornecedor.

### Como a Tabela Funciona?
1. **Status SMM Automático:** A cada segundo, o sistema monitora e pede atualizações de status ao fornecedor. Você vê os status `Pendente`, `Em progresso`, `Concluído`, ou `Cancelado` exatamente como aparecem no painel deles.
2. **Coluna "ID SMM":** 
   - Quando um pedido vai para o DukeFornecedor, ele gera um comprovante (Ex: ID `859302`). Esse número fica azul no seu painel. Se um cliente reclamar que não recebeu as views, é ESSE código que você vai pesquisar lá no DukeFornecedor para abrir um chamado de suporte.
3. **Contagem de Views Inicial & Progresso:** Mostra quantas views o cliente já tinha antes da compra e quantas faltam cair.

### Resolução de Problemas
- **Perfil Trancado ou Errado:** Se a conta do cliente estiver Privada no Instagram, o fornecedor SMM vai automaticamente cancelar a ordem e devolver o saldo para o seu painel SMM. O nosso painel marcará como "Cancelado". Neste caso, contate o cliente para pegar um link público e refaça a ordem manualmente pelo seu saldo.
- **Erro SMM:** Se a tabela mostrar um erro vermelho, significa que o Webhook falhou em conectar ao fornecedor (geralmente por falta de saldo pré-carregado lá no DukeFornecedor). Você fica com o dinheiro do cliente e terá que enviar as views manualmente pelo painel deles.

---

## 4. O Cérebro do Tráfego: SEO & Facebook Ads
Acessando o menu **SEO & Branding** (`/administracao/settings`), você controla o rastreamento das suas vendas sem precisar encostar em códigos.

### SEO Dinâmico (Título do Site)
- Você pode alterar o Título e a Descrição do site diretamente aqui. O Google e as prévias de link do WhatsApp sempre lerão essas informações automaticamente na próxima vez que você limpar o cache.
- O Favicon (A aba do navegador) está atualmente definido no código base (Um ícone SVG de Seta Vermelha de crescimento).

### Facebook Pixel e Conversions API (CAPI)
Nosso sistema possui o rastreamento mais agressivo e preciso do mercado para garantir ROI no Tráfego Pago.

1. **Pixel ID:** Cole os números do seu Pixel aqui. 
   - Dispara evento de `PageView` a cada visita e de `InitiateCheckout` na hora exata em que o cliente clica para gerar o PIX.
2. **Conversions API Token (CAPI):** Cole o Token gigante gerado na Meta.
   - O evento de `Purchase` (Compra) é disparado pelo Backend via CAPI. Quando o Webhook cai, nosso servidor avisa o servidor da Meta. Isso drible 100% os Bloqueadores de Anúncios.

---

## 5. Como funciona o Fluxo de Vendas? (Webhook)
Se você quer entender como o dinheiro e a automação se movem, este é o fluxo:

1. **Geração:** O cliente clica no botão, a API chama a PushinPay, que devolve o QR Code e o "Pix Copia e Cola".
2. **Pagamento:** O cliente paga o Pix no banco.
3. **O Gatilho (Webhook):** Em menos de 1 segundo, a PushinPay manda um sinal POST para `https://viralizareels.com/api/webhooks/pushinpay`.
4. **Validação:** A API cruza a transação para evitar golpes e falsificações.
5. **Automação SMM:** Se for válido, a API pega sua chave da PerfectPanel no `.env`, cria uma ordem para o Serviço 379 (DukeFornecedor).
6. **Finalização:** A ordem salva o ID, registra o faturamento no Dashboard, e dispara o *Purchase* pro Facebook.

> **Regra de Ouro:** Sem a URL correta do Webhook cadastrada lá no Painel da PushinPay, os Pix vão cair na sua conta, mas os clientes **não** vão receber as views porque o sistema nunca ficará sabendo que foi pago. Não esqueça de deixar isso configurado!

---

## 6. Rotinas Técnicas Rápidas (VPS)
Como você roda o servidor numa VPS AlmaLinux via CyberPanel, as manutenções devem ser feitas acessando a VPS. As rotinas completas e os detalhes de **Backup Rotativo a cada 3 Horas** estão descritos no arquivo separado `MANUAL_VPS.md` na raiz do seu servidor.

Boas Vendas e rumo ao topo! 🚀
