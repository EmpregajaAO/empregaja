# 📋 Guia Completo - Sistema de Validação de Pagamentos (Admin)

## 🎯 Como Funciona o Sistema

### 1️⃣ **Fluxo do Candidato**
1. Candidato faz pagamento (transferência bancária, depósito, etc.)
2. Candidato acessa seu perfil e envia comprovativo de pagamento
3. Comprovativo fica com status `pendente` no sistema
4. Admin recebe notificação de novo comprovativo

### 2️⃣ **Fluxo do Administrador**
1. Admin acessa: `/admin` → Tab **"Comprovativos"**
2. Vê todos os pagamentos pendentes com:
   - Nome do candidato
   - Telefone
   - Tipo de serviço
   - Valor
   - Data de envio
3. Admin clica em **"Ver"** para visualizar o comprovativo
4. Admin decide:
   - ✅ **Aprovar** → Libera acesso automaticamente
   - ❌ **Rejeitar** → Informa motivo ao candidato

### 3️⃣ **O que Acontece na Aprovação (AUTOMÁTICO)**

#### Se for **Criação de Perfil** ou **Perfil Básico**:
```
✅ Perfil aprovado
✅ Candidato pode acessar o sistema
✅ Status muda de "pendente" → "aprovado"
```

#### Se for **Conta Ativo** (30 dias):
```
✅ Conta upgrade para "ativo"
✅ Acesso por 30 dias
✅ Data de expiração definida
✅ Funcionalidades premium liberadas
```

#### Se for **Conta PRO** (1 ano):
```
✅ Conta upgrade para "pro"
✅ Acesso por 1 ano
✅ Todas funcionalidades premium
✅ Destaque no sistema
```

#### Se for **Curso**:
```
✅ Matrícula no curso ativada
✅ Acesso a todas as aulas
✅ Certificado ao concluir
```

---

## 🔐 Segurança

- ✅ Apenas admins autenticados podem validar
- ✅ Verificação via `user_roles` table
- ✅ Todas ações registradas com timestamp
- ✅ Candidato não pode auto-aprovar

---

## 📊 Dashboard de Estatísticas

O painel mostra em tempo real:
- Total de pagamentos recebidos
- Pagamentos pendentes de validação
- Pagamentos aprovados
- Valor total aprovado (em Kz)

---

## 🔍 Filtros e Pesquisa

**Filtrar por Status:**
- Todos
- Pendentes
- Aprovados
- Rejeitados

**Pesquisar por:**
- Nome do candidato
- Telefone
- Tipo de serviço

---

## ❌ Rejeição com Motivo

Ao rejeitar um pagamento:
1. Admin informa o motivo (ex: "Valor incorreto", "Comprovativo ilegível")
2. Candidato recebe notificação com o motivo
3. Candidato pode reenviar comprovativo corrigido

---

## 🧪 Testar o Sistema

### Como criar comprovativo de teste:

**Opção 1 - Via Supabase (SQL Editor):**
```sql
INSERT INTO comprovativos_pagamento (
  candidato_id, 
  valor, 
  tipo_servico, 
  comprovativo_url, 
  status
) 
VALUES (
  (SELECT id FROM candidatos LIMIT 1),
  5000,
  'conta_pro',
  'https://via.placeholder.com/600x800/0066cc/ffffff?text=Comprovativo+de+Teste',
  'pendente'
);
```

**Opção 2 - Via Frontend:**
O candidato envia através do seu painel em `/perfil-candidato`

---

## 🆘 Troubleshooting

### Problema: "Não aparecem pagamentos pendentes"
**Solução:**
1. Verificar se há comprovativos com `status = 'pendente'`
2. Verificar se está logado como admin
3. Verificar RLS policies no Supabase

### Problema: "Erro ao aprovar pagamento"
**Solução:**
1. Verificar se candidato_id é válido
2. Verificar se tipo_servico está correto
3. Ver console do navegador para detalhes

### Problema: "Candidato não recebe acesso após aprovação"
**Solução:**
1. Verificar se a tabela correta foi atualizada
2. Verificar logs no Supabase
3. Candidato deve fazer logout/login para ver mudanças

---

## 📱 Tipos de Serviço Suportados

| Tipo | Valor | Duração | O que libera |
|------|-------|---------|--------------|
| `perfil_basico` ou `criacao_perfil` | 5.000 Kz | Vitalício | Acesso ao sistema |
| `conta_ativo` ou `perfil_ativo` | 10.000 Kz | 30 dias | Destaque + funcionalidades |
| `conta_pro` | 50.000 Kz | 1 ano | Tudo premium |
| `curso` | Variável | Vitalício | Acesso ao curso específico |

---

## 🚀 Acessar o Painel

1. Fazer login como admin
2. Ir para: `/admin`
3. Clicar na tab **"Comprovativos"**
4. Ver pagamentos pendentes
5. Validar ou rejeitar

---

## 💡 Dicas

- ✅ Sempre verificar a imagem do comprovativo antes de aprovar
- ✅ Usar filtros para encontrar pagamentos rapidamente
- ✅ Ao rejeitar, sempre informar motivo claro
- ✅ Verificar se o valor corresponde ao tipo de serviço
- ✅ Dashboard atualiza automaticamente após cada ação

---

## 📞 Suporte

Para problemas técnicos:
1. Verificar console do navegador (F12)
2. Verificar logs do Supabase
3. Verificar se admin tem role correto em `user_roles`

---

**Sistema criado com Lovable + Supabase**
**Última atualização: 2025**
