# 🔌 Manual de Integração SMM: Duke Fornecedor (PerfectPanel API)

Este documento descreve como realizar a integração automatizada com o fornecedor SMM **Duke Fornecedor**, que utiliza o protocolo padrão da API **PerfectPanel**. Este guia serve como especificação para implementar a mesma lógica de envio de pedidos e consulta de status em outros sistemas.

---

## ⚙️ 1. Configurações Necessárias

Para realizar a comunicação, o sistema de destino precisará armazenar três variáveis de configuração por serviço/plataforma:

1.  **API URL:** A URL do gateway do fornecedor (Exemplo: `https://dukefornecedor.com/api/v2`).
2.  **API Key (Token):** A chave de autenticação privada gerada na conta do cliente dentro do painel da Duke Fornecedor.
3.  **Service ID (ID do Serviço):** O código numérico identificador do serviço a ser contratado (ex: `398` para Seguidores Brasileiros, `402` para Curtidas, etc.). *Cada pacote no banco de dados deve estar associado a um Service ID específico.*

---

## 🔗 2. Regras de Formatação de Links (Username vs Post Link)

Os painéis SMM exigem que o parâmetro `link` enviado na API seja uma URL válida. Dependendo do tipo de serviço, o sistema deve formatar o input do usuário:

### A. Para Serviços de Perfil (Seguidores)
O cliente digita apenas o `@usuário`. O sistema deve limpar o caractere `@` e estruturar a URL completa da plataforma correspondente antes de enviar para a API:
*   **Instagram:** `https://instagram.com/username`
*   **TikTok:** `https://www.tiktok.com/@username`
*   **Outra plataforma (ex: Kwai):** `https://kwai.com/username`

### B. Para Serviços de Postagem (Curtidas / Visualizações / Comentários)
O checkout captura a URL direta do post selecionado no grid (obtido via scraper) ou fornecido pelo cliente. Esse link é enviado **literalmente** à API do fornecedor.

---

## 📡 3. Especificação das Chamadas de API

Todas as requisições para a API PerfectPanel devem utilizar:
*   **Método:** `POST`
*   **Content-Type:** `application/x-www-form-urlencoded`
*   **User-Agent:** Recomenda-se definir um cabeçalho de User-Agent customizado para evitar bloqueios de firewalls (como Cloudflare) na API do fornecedor.

---

### 📥 A. Criar Novo Pedido (Action: `add`)

Envia uma ordem de serviço para ser processada e entregue pelo fornecedor.

#### Parâmetros do Corpo da Requisição (Form Data)
| Campo | Tipo | Valor / Descrição |
| :--- | :--- | :--- |
| `key` | String | A chave de API do Duke Fornecedor. |
| `action` | String | Deve ser `"add"`. |
| `service` | String | O ID numérico do serviço (Service ID). |
| `link` | String | A URL formatada do perfil ou da postagem. |
| `quantity` | String | A quantidade a ser entregue (convertido para string). |

#### Exemplo de Resposta de Sucesso (200 OK)
```json
{
  "order": 123456
}
```
> **Nota:** Guarde o número `order` (ID do pedido) no seu banco de dados para rastrear o status e abrir tickets de suporte caso necessário.

#### Exemplo de Resposta de Erro (200 OK ou 400)
```json
{
  "error": "Not enough funds on balance"
}
```
*Trate este retorno exibindo o erro nos logs administrativos ou alertando o administrador de que o saldo do fornecedor acabou.*

---

### 🔍 B. Consultar Status do Pedido (Action: `status`)

Consulta o andamento de um ou mais pedidos de forma simultânea.

#### Parâmetros do Corpo da Requisição (Form Data)
| Campo | Tipo | Valor / Descrição |
| :--- | :--- | :--- |
| `key` | String | A chave de API do Duke Fornecedor. |
| `action` | String | Deve ser `"status"`. |
| `orders` | String | Lista de IDs de pedidos separados por vírgula (Ex: `"123456,123457"`). |

#### Exemplo de Resposta de Sucesso (200 OK)
A resposta retorna um mapa contendo os IDs consultados como chaves principais:
```json
{
  "123456": {
    "status": "Pending",
    "start_count": "1542",
    "remains": "500"
  },
  "123457": {
    "status": "Completed",
    "start_count": "540",
    "remains": "0"
  }
}
```

#### Possíveis Status Retornados
*   `Pending`: Pedido aguardando início da entrega na fila.
*   `In progress`: Pedido sendo entregue ativamente.
*   `Completed`: Entrega finalizada com sucesso.
*   `Partial`: Entrega parcial (parte dos itens não pôde ser entregue e o valor correspondente foi reembolsado ao seu saldo).
*   `Canceled`: Pedido cancelado e valor totalmente reembolsado ao seu saldo.

---

## 💻 4. Exemplo Prático de Código (Node.js / TypeScript)

Abaixo está o código de exemplo utilizando a API nativa `fetch` para envio do pedido:

```typescript
export async function sendOrderToSMM(
  apiUrl: string, 
  apiKey: string, 
  serviceId: string, 
  link: string, 
  quantity: number
) {
  try {
    // 1. Preparar os dados como x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("key", apiKey);
    formData.append("action", "add");
    formData.append("service", serviceId);
    formData.append("link", link);
    formData.append("quantity", quantity.toString());

    // 2. Executar a requisição POST
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SMMClient/1.0",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    // 3. Tratar retornos de erro da API
    if (data.error) {
      console.error("Erro retornado pelo painel SMM:", data.error);
      return { success: false, error: data.error };
    }

    // 4. Retornar o ID do pedido gerado
    return { success: true, orderId: data.order.toString() };
  } catch (error: any) {
    console.error("Erro de conexão com o painel SMM:", error);
    return { success: false, error: error.message || "Falha na conexão" };
  }
}
```
