# 📡 Documentação do Webhook de Vagas - EmpregaJá

## 🔗 Endpoint da API

```
POST https://qjoyyevmdfbdcbhekisy.supabase.co/functions/v1/receber-vaga
```

## 🔑 Autenticação

O endpoint é **público** e não requer autenticação via Bearer token. 

> **Nota**: Para maior segurança em produção, recomenda-se adicionar autenticação por API key no futuro.

## 📥 Formato da Requisição

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "data": {
    "titulo": "Desenvolvedor Full Stack",
    "empresa": "Tech Angola Lda",
    "local": "Luanda, Angola",
    "data": "2025-01-20T10:00:00Z",
    "descricao": "Procuramos um desenvolvedor full stack com experiência em React e Node.js...",
    "link": "https://exemplo.com/vaga/123",
    "origem": "Net-Empregos",
    "external_id": "net-empregos-123456"
  }
}
```

## 📋 Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `titulo` | string | Título da vaga | "Desenvolvedor Full Stack" |
| `empresa` | string | Nome da empresa | "Tech Angola Lda" |
| `local` | string | Localização da vaga | "Luanda, Angola" |
| `data` | string | Data de publicação (ISO 8601) | "2025-01-20T10:00:00Z" |
| `descricao` | string | Descrição completa da vaga | "Procuramos..." |
| `link` | string | URL da vaga original | "https://exemplo.com/vaga/123" |
| `origem` | string | Fonte da vaga | "Net-Empregos" ou "Jobartis" |
| `external_id` | string | ID único da vaga (para evitar duplicatas) | "net-empregos-123456" |

## ✅ Resposta de Sucesso

### Vaga Criada (201 Created)
```json
{
  "success": true,
  "message": "Vaga criada com sucesso",
  "vaga_id": "uuid-da-vaga",
  "action": "created"
}
```

### Vaga Atualizada (200 OK)
```json
{
  "success": true,
  "message": "Vaga atualizada com sucesso",
  "vaga_id": "uuid-da-vaga",
  "action": "updated"
}
```

## ❌ Resposta de Erro (400 Bad Request)
```json
{
  "success": false,
  "error": "Campo obrigatório ausente: titulo"
}
```

## 🤖 Exemplo de Script para Google Apps Script

```javascript
function enviarVagaParaEmpregaJa() {
  const url = 'https://qjoyyevmdfbdcbhekisy.supabase.co/functions/v1/receber-vaga';
  
  const vaga = {
    data: {
      titulo: "Desenvolvedor Full Stack",
      empresa: "Tech Angola Lda",
      local: "Luanda, Angola",
      data: new Date().toISOString(),
      descricao: "Procuramos um desenvolvedor full stack com experiência em React e Node.js. Requisitos: 3+ anos de experiência, conhecimento em TypeScript, experiência com bancos de dados SQL.",
      link: "https://net-empregos.co.ao/vaga/123456",
      origem: "Net-Empregos",
      external_id: "net-empregos-123456"
    }
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(vaga),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.success) {
      Logger.log('✅ Vaga enviada com sucesso: ' + result.vaga_id);
      Logger.log('Ação: ' + result.action);
    } else {
      Logger.log('❌ Erro ao enviar vaga: ' + result.error);
    }
  } catch (error) {
    Logger.log('❌ Erro na requisição: ' + error);
  }
}

// Função para enviar múltiplas vagas
function enviarMultiplasVagas(vagas) {
  const url = 'https://qjoyyevmdfbdcbhekisy.supabase.co/functions/v1/receber-vaga';
  
  vagas.forEach((vaga, index) => {
    Utilities.sleep(1000); // Esperar 1 segundo entre requisições
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ data: vaga }),
      muteHttpExceptions: true
    };
    
    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      
      Logger.log(`Vaga ${index + 1}/${vagas.length}: ${result.success ? '✅' : '❌'} ${result.message || result.error}`);
    } catch (error) {
      Logger.log(`Vaga ${index + 1}/${vagas.length}: ❌ Erro - ${error}`);
    }
  });
}
```

## 🔄 Lógica de Deduplicação

O sistema usa o campo `external_id` para evitar duplicatas:

- Se uma vaga com o mesmo `external_id` já existir, ela será **atualizada**
- Se não existir, uma **nova vaga** será criada

Isso garante que você pode executar o script múltiplas vezes sem criar vagas duplicadas.

## 📊 Monitoramento

Você pode monitorar as vagas no painel administrativo em:
```
https://empregaja.lovable.app/admin
```

Na aba "Vagas", você poderá:
- Ver todas as vagas agregadas
- Ativar/desativar vagas
- Ver a origem de cada vaga
- Acessar o link original

## 🔐 Segurança Futura

Para implementar autenticação por API key no futuro:

1. Adicionar um campo `api_key` na requisição:
```javascript
headers: {
  'Authorization': 'Bearer SUA_API_KEY_AQUI'
}
```

2. Validar a API key no edge function antes de processar a vaga

## 🆘 Suporte

Para questões ou problemas, entre em contato através do painel administrativo ou abra uma issue no repositório do projeto.
