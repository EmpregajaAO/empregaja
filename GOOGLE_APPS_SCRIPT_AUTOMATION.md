# 🤖 Sistema de Automação Completo - Google Apps Script

## 📋 Passo a Passo para Implementar

### 1. Criar novo projeto no Google Apps Script
1. Acesse: https://script.google.com
2. Clique em "Novo projeto"
3. Renomeie para "EmpregaJá - Agregador de Vagas"

### 2. Criar os arquivos necessários

#### Arquivo: `Config.gs`
```javascript
/**
 * Configurações centralizadas do sistema
 */
const CONFIG = {
  // URL do seu webhook
  WEBHOOK_URL: 'https://qjoyyevmdfbdcbhekisy.supabase.co/functions/v1/receber-vaga',
  
  // URLs dos portais de emprego
  PORTAIS: {
    NET_EMPREGOS: 'https://net-empregos.com',
    JOBARTIS: 'https://www.jobartis.com/vagas'
  },
  
  // Configurações de execução
  INTERVALO_HORAS: 1,
  DELAY_ENTRE_VAGAS_MS: 1000,
  MAX_VAGAS_POR_EXECUCAO: 50,
  
  // Email para notificações de erro
  EMAIL_NOTIFICACAO: Session.getActiveUser().getEmail(),
  
  // ID da planilha de logs (será criada automaticamente)
  SHEET_ID: null
};

/**
 * Retorna a configuração
 */
function getConfig() {
  return CONFIG;
}
```

#### Arquivo: `Logger.gs`
```javascript
/**
 * Sistema de logs avançado
 */

// Criar planilha de logs se não existir
function criarPlanilhaLogs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('EmpregaJá - Logs de Coleta');
  
  let sheet = ss.getSheetByName('Logs');
  if (!sheet) {
    sheet = ss.insertSheet('Logs');
    sheet.appendRow(['Data/Hora', 'Tipo', 'Portal', 'Mensagem', 'Detalhes']);
    sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  }
  
  let statsSheet = ss.getSheetByName('Estatísticas');
  if (!statsSheet) {
    statsSheet = ss.insertSheet('Estatísticas');
    statsSheet.appendRow(['Data', 'Portal', 'Total Coletadas', 'Novas', 'Atualizadas', 'Erros', 'Tempo (s)']);
    statsSheet.getRange('A1:G1').setFontWeight('bold').setBackground('#0f9d58').setFontColor('#ffffff');
  }
  
  Logger.log('📊 Planilha de logs criada: ' + ss.getUrl());
  return ss;
}

// Obter planilha de logs
function getLogSheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = criarPlanilhaLogs();
  }
  return ss.getSheetByName('Logs');
}

// Registrar log
function logEvento(tipo, portal, mensagem, detalhes = '') {
  try {
    const sheet = getLogSheet();
    const timestamp = new Date();
    sheet.appendRow([timestamp, tipo, portal, mensagem, JSON.stringify(detalhes)]);
    
    // Manter apenas últimos 1000 registros
    if (sheet.getLastRow() > 1000) {
      sheet.deleteRows(2, 100);
    }
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
}

// Registrar estatísticas
function logEstatisticas(portal, totalColetadas, novas, atualizadas, erros, tempoSegundos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Estatísticas');
    const data = new Date();
    
    sheet.appendRow([data, portal, totalColetadas, novas, atualizadas, erros, tempoSegundos]);
  } catch (error) {
    console.error('Erro ao registrar estatísticas:', error);
  }
}

// Enviar email de notificação
function notificarErro(portal, erro) {
  try {
    const config = getConfig();
    const assunto = `⚠️ Erro na coleta de vagas - ${portal}`;
    const corpo = `
      Ocorreu um erro durante a coleta de vagas do portal ${portal}.
      
      Erro: ${erro}
      
      Data/Hora: ${new Date().toLocaleString('pt-BR')}
      
      Verifique os logs em: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
    `;
    
    MailApp.sendEmail(config.EMAIL_NOTIFICACAO, assunto, corpo);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}
```

#### Arquivo: `Webhook.gs`
```javascript
/**
 * Funções para comunicação com o webhook
 */

function enviarVagaParaEmpregaJa(vaga) {
  const config = getConfig();
  
  const payload = {
    data: {
      titulo: vaga.titulo,
      empresa: vaga.empresa,
      local: vaga.local,
      data: vaga.data || new Date().toISOString(),
      descricao: vaga.descricao,
      link: vaga.link,
      origem: vaga.origem,
      external_id: vaga.external_id
    }
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(config.WEBHOOK_URL, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.success) {
      logEvento('SUCESSO', vaga.origem, `Vaga enviada: ${vaga.titulo}`, result);
      return result;
    } else {
      logEvento('ERRO', vaga.origem, `Falha ao enviar: ${vaga.titulo}`, result);
      return null;
    }
  } catch (error) {
    logEvento('ERRO', vaga.origem, `Exceção ao enviar: ${vaga.titulo}`, error.toString());
    return null;
  }
}

function enviarVagasEmLote(vagas, origem) {
  const config = getConfig();
  let novas = 0;
  let atualizadas = 0;
  let erros = 0;
  
  vagas.forEach((vaga, index) => {
    try {
      const resultado = enviarVagaParaEmpregaJa({...vaga, origem: origem});
      
      if (resultado) {
        if (resultado.action === 'created') novas++;
        if (resultado.action === 'updated') atualizadas++;
      } else {
        erros++;
      }
      
      // Delay entre requisições
      if (index < vagas.length - 1) {
        Utilities.sleep(config.DELAY_ENTRE_VAGAS_MS);
      }
    } catch (error) {
      erros++;
      logEvento('ERRO', origem, `Erro ao processar vaga ${index + 1}`, error.toString());
    }
  });
  
  return { novas, atualizadas, erros };
}
```

#### Arquivo: `NetEmpregos.gs`
```javascript
/**
 * Scraper para Net-Empregos
 */

function coletarNetEmpregos() {
  const inicio = new Date();
  const portal = 'Net-Empregos';
  
  logEvento('INICIO', portal, 'Iniciando coleta de vagas');
  
  try {
    // IMPORTANTE: Você precisa ajustar esta URL para a real do Net-Empregos
    const url = 'https://net-empregos.com/vagas'; // Ajustar URL real
    
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP ${response.getResponseCode()}`);
    }
    
    const html = response.getContentText();
    const vagas = extrairVagasNetEmpregos(html);
    
    logEvento('INFO', portal, `${vagas.length} vagas encontradas`);
    
    // Limitar quantidade
    const config = getConfig();
    const vagasLimitadas = vagas.slice(0, config.MAX_VAGAS_POR_EXECUCAO);
    
    // Enviar vagas
    const resultado = enviarVagasEmLote(vagasLimitadas, portal);
    
    // Calcular tempo
    const fim = new Date();
    const tempoSegundos = (fim - inicio) / 1000;
    
    // Registrar estatísticas
    logEstatisticas(
      portal,
      vagasLimitadas.length,
      resultado.novas,
      resultado.atualizadas,
      resultado.erros,
      tempoSegundos
    );
    
    logEvento('FIM', portal, `Coleta finalizada. Novas: ${resultado.novas}, Atualizadas: ${resultado.atualizadas}, Erros: ${resultado.erros}`);
    
    return resultado;
    
  } catch (error) {
    logEvento('ERRO', portal, 'Erro na coleta', error.toString());
    notificarErro(portal, error.toString());
    throw error;
  }
}

function extrairVagasNetEmpregos(html) {
  const vagas = [];
  
  /**
   * IMPORTANTE: Você precisa adaptar este código para a estrutura real do Net-Empregos
   * 
   * Exemplo de estrutura que você precisa identificar no HTML:
   * - Onde estão os títulos das vagas?
   * - Onde estão os nomes das empresas?
   * - Onde estão os links para as vagas?
   * 
   * Use regex ou busque por padrões específicos no HTML
   */
  
  // EXEMPLO GENÉRICO - ADAPTAR PARA O SITE REAL
  try {
    // Procurar por blocos de vagas (adaptar seletores)
    const regexVaga = /<div class="vaga-item">(.*?)<\/div>/gs;
    const matches = html.matchAll(regexVaga);
    
    for (const match of matches) {
      const blocoVaga = match[1];
      
      // Extrair título (adaptar)
      const tituloMatch = blocoVaga.match(/<h3[^>]*>(.*?)<\/h3>/);
      const titulo = tituloMatch ? tituloMatch[1].trim() : '';
      
      // Extrair empresa (adaptar)
      const empresaMatch = blocoVaga.match(/<span class="empresa">(.*?)<\/span>/);
      const empresa = empresaMatch ? empresaMatch[1].trim() : 'Empresa não informada';
      
      // Extrair localização (adaptar)
      const localMatch = blocoVaga.match(/<span class="local">(.*?)<\/span>/);
      const local = localMatch ? localMatch[1].trim() : 'Angola';
      
      // Extrair link (adaptar)
      const linkMatch = blocoVaga.match(/href="([^"]+)"/);
      const link = linkMatch ? linkMatch[1] : '';
      
      // Extrair descrição (adaptar)
      const descricaoMatch = blocoVaga.match(/<p class="descricao">(.*?)<\/p>/);
      const descricao = descricaoMatch ? descricaoMatch[1].trim() : '';
      
      // Gerar ID único baseado no link ou título
      const external_id = 'net-' + (link ? link.split('/').pop() : Buffer.from(titulo).toString('base64').substring(0, 20));
      
      if (titulo && link) {
        vagas.push({
          titulo: titulo,
          empresa: empresa,
          local: local,
          descricao: descricao || titulo,
          link: link.startsWith('http') ? link : 'https://net-empregos.com' + link,
          external_id: external_id
        });
      }
    }
  } catch (error) {
    logEvento('ERRO', 'Net-Empregos', 'Erro ao extrair vagas do HTML', error.toString());
  }
  
  return vagas;
}
```

#### Arquivo: `Jobartis.gs`
```javascript
/**
 * Scraper para Jobartis
 */

function coletarJobartis() {
  const inicio = new Date();
  const portal = 'Jobartis';
  
  logEvento('INICIO', portal, 'Iniciando coleta de vagas');
  
  try {
    const url = 'https://www.jobartis.com/vagas'; // Ajustar URL real
    
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP ${response.getResponseCode()}`);
    }
    
    const html = response.getContentText();
    const vagas = extrairVagasJobartis(html);
    
    logEvento('INFO', portal, `${vagas.length} vagas encontradas`);
    
    const config = getConfig();
    const vagasLimitadas = vagas.slice(0, config.MAX_VAGAS_POR_EXECUCAO);
    
    const resultado = enviarVagasEmLote(vagasLimitadas, portal);
    
    const fim = new Date();
    const tempoSegundos = (fim - inicio) / 1000;
    
    logEstatisticas(
      portal,
      vagasLimitadas.length,
      resultado.novas,
      resultado.atualizadas,
      resultado.erros,
      tempoSegundos
    );
    
    logEvento('FIM', portal, `Coleta finalizada. Novas: ${resultado.novas}, Atualizadas: ${resultado.atualizadas}, Erros: ${resultado.erros}`);
    
    return resultado;
    
  } catch (error) {
    logEvento('ERRO', portal, 'Erro na coleta', error.toString());
    notificarErro(portal, error.toString());
    throw error;
  }
}

function extrairVagasJobartis(html) {
  const vagas = [];
  
  // ADAPTAR PARA A ESTRUTURA REAL DO JOBARTIS
  try {
    const regexVaga = /<article class="job-listing">(.*?)<\/article>/gs;
    const matches = html.matchAll(regexVaga);
    
    for (const match of matches) {
      const blocoVaga = match[1];
      
      const tituloMatch = blocoVaga.match(/<h2[^>]*>(.*?)<\/h2>/);
      const titulo = tituloMatch ? tituloMatch[1].trim() : '';
      
      const empresaMatch = blocoVaga.match(/<div class="company">(.*?)<\/div>/);
      const empresa = empresaMatch ? empresaMatch[1].trim() : 'Empresa não informada';
      
      const localMatch = blocoVaga.match(/<div class="location">(.*?)<\/div>/);
      const local = localMatch ? localMatch[1].trim() : 'Angola';
      
      const linkMatch = blocoVaga.match(/href="([^"]+)"/);
      const link = linkMatch ? linkMatch[1] : '';
      
      const descricaoMatch = blocoVaga.match(/<div class="description">(.*?)<\/div>/);
      const descricao = descricaoMatch ? descricaoMatch[1].trim() : '';
      
      const external_id = 'jobartis-' + (link ? link.split('/').pop() : Buffer.from(titulo).toString('base64').substring(0, 20));
      
      if (titulo && link) {
        vagas.push({
          titulo: titulo,
          empresa: empresa,
          local: local,
          descricao: descricao || titulo,
          link: link.startsWith('http') ? link : 'https://www.jobartis.com' + link,
          external_id: external_id
        });
      }
    }
  } catch (error) {
    logEvento('ERRO', 'Jobartis', 'Erro ao extrair vagas do HTML', error.toString());
  }
  
  return vagas;
}
```

#### Arquivo: `Triggers.gs`
```javascript
/**
 * Configuração de triggers automáticos
 */

function configurarAutomacao() {
  // Limpar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  const config = getConfig();
  
  // Net-Empregos - A cada 1 hora
  ScriptApp.newTrigger('coletarNetEmpregos')
    .timeBased()
    .everyHours(config.INTERVALO_HORAS)
    .create();
  
  // Jobartis - A cada 2 horas (offset de 30 min)
  ScriptApp.newTrigger('coletarJobartis')
    .timeBased()
    .everyHours(2)
    .create();
  
  // Relatório diário às 9h
  ScriptApp.newTrigger('enviarRelatorioDiario')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
  
  logEvento('SISTEMA', 'Automação', 'Triggers configurados com sucesso');
  Logger.log('✅ Automação configurada!');
  Logger.log('📊 Logs disponíveis em: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}

function removerAutomacao() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  logEvento('SISTEMA', 'Automação', 'Triggers removidos');
  Logger.log('🛑 Automação desativada');
}

function listarTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  
  Logger.log(`\n📋 Triggers ativos (${triggers.length}):\n`);
  
  triggers.forEach((trigger, index) => {
    Logger.log(`${index + 1}. ${trigger.getHandlerFunction()}`);
    Logger.log(`   Tipo: ${trigger.getEventType()}`);
  });
}
```

#### Arquivo: `Relatorios.gs`
```javascript
/**
 * Sistema de relatórios
 */

function enviarRelatorioDiario() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const statsSheet = ss.getSheetByName('Estatísticas');
    
    if (!statsSheet) return;
    
    // Obter dados de ontem
    const hoje = new Date();
    const ontem = new Date(hoje.setDate(hoje.getDate() - 1));
    const dataOntem = Utilities.formatDate(ontem, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    const data = statsSheet.getDataRange().getValues();
    const header = data[0];
    const rows = data.slice(1);
    
    // Filtrar dados de ontem
    const dadosOntem = rows.filter(row => {
      const dataRow = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      return dataRow === dataOntem;
    });
    
    if (dadosOntem.length === 0) {
      Logger.log('Nenhum dado para relatório de ontem');
      return;
    }
    
    // Calcular totais
    let totalColetadas = 0;
    let totalNovas = 0;
    let totalAtualizadas = 0;
    let totalErros = 0;
    
    const portalStats = {};
    
    dadosOntem.forEach(row => {
      const portal = row[1];
      const coletadas = row[2];
      const novas = row[3];
      const atualizadas = row[4];
      const erros = row[5];
      
      totalColetadas += coletadas;
      totalNovas += novas;
      totalAtualizadas += atualizadas;
      totalErros += erros;
      
      if (!portalStats[portal]) {
        portalStats[portal] = { coletadas: 0, novas: 0, atualizadas: 0, erros: 0 };
      }
      
      portalStats[portal].coletadas += coletadas;
      portalStats[portal].novas += novas;
      portalStats[portal].atualizadas += atualizadas;
      portalStats[portal].erros += erros;
    });
    
    // Montar email
    const config = getConfig();
    const assunto = `📊 Relatório Diário - EmpregaJá (${dataOntem})`;
    
    let corpo = `
      <h2>Relatório de Coleta de Vagas - ${dataOntem}</h2>
      
      <h3>📈 Resumo Geral</h3>
      <ul>
        <li><strong>Total de vagas coletadas:</strong> ${totalColetadas}</li>
        <li><strong>Novas vagas:</strong> ${totalNovas}</li>
        <li><strong>Vagas atualizadas:</strong> ${totalAtualizadas}</li>
        <li><strong>Erros:</strong> ${totalErros}</li>
      </ul>
      
      <h3>🌐 Por Portal</h3>
    `;
    
    Object.keys(portalStats).forEach(portal => {
      const stats = portalStats[portal];
      corpo += `
        <h4>${portal}</h4>
        <ul>
          <li>Coletadas: ${stats.coletadas}</li>
          <li>Novas: ${stats.novas}</li>
          <li>Atualizadas: ${stats.atualizadas}</li>
          <li>Erros: ${stats.erros}</li>
        </ul>
      `;
    });
    
    corpo += `
      <hr>
      <p>Ver logs completos: <a href="${ss.getUrl()}">Planilha de Logs</a></p>
      <p>Ver site: <a href="https://empregaja.lovable.app/vagas">EmpregaJá - Vagas</a></p>
    `;
    
    MailApp.sendEmail({
      to: config.EMAIL_NOTIFICACAO,
      subject: assunto,
      htmlBody: corpo
    });
    
    logEvento('RELATORIO', 'Sistema', 'Relatório diário enviado');
    
  } catch (error) {
    logEvento('ERRO', 'Relatório', 'Erro ao enviar relatório', error.toString());
  }
}

function gerarRelatorioManual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url = ss.getUrl();
  
  Logger.log('\n📊 RELATÓRIO MANUAL\n');
  Logger.log('Acesse a planilha de logs: ' + url);
  Logger.log('\nAbas disponíveis:');
  Logger.log('- Logs: Histórico detalhado de todas as operações');
  Logger.log('- Estatísticas: Métricas agregadas por execução');
}
```

#### Arquivo: `Menu.gs`
```javascript
/**
 * Menu personalizado na planilha
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🤖 EmpregaJá')
    .addItem('⚙️ Configurar Automação', 'configurarAutomacao')
    .addItem('🛑 Desativar Automação', 'removerAutomacao')
    .addSeparator()
    .addItem('🔄 Coletar Net-Empregos Agora', 'coletarNetEmpregos')
    .addItem('🔄 Coletar Jobartis Agora', 'coletarJobartis')
    .addSeparator()
    .addItem('📊 Ver Triggers Ativos', 'listarTriggers')
    .addItem('📧 Enviar Relatório', 'enviarRelatorioDiario')
    .addItem('📈 Ver Dashboard', 'abrirDashboard')
    .addToUi();
}

function abrirDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url = 'https://empregaja.lovable.app/admin';
  
  const html = HtmlService.createHtmlOutput(`
    <p>Dashboard disponível em:</p>
    <p><a href="${url}" target="_blank">${url}</a></p>
    <br>
    <p>Logs locais:</p>
    <p><a href="${ss.getUrl()}" target="_blank">Planilha de Logs</a></p>
  `);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Dashboard EmpregaJá');
}
```

---

## 🚀 Como Usar

### Configuração Inicial (Fazer 1 vez)

1. **Criar o projeto no Google Apps Script**
   - Acesse: https://script.google.com
   - Clique em "Novo projeto"
   
2. **Copiar todos os arquivos acima**
   - Crie cada arquivo .gs no projeto
   - Cole o código correspondente

3. **Adaptar os scrapers**
   - Abra `NetEmpregos.gs` e `Jobartis.gs`
   - Adapte as regex/seletores para a estrutura real dos sites
   
4. **Executar setup**
   - Execute a função `criarPlanilhaLogs()` uma vez
   - Execute a função `configurarAutomacao()`

### Uso Diário

- **Automático**: O sistema roda sozinho a cada hora
- **Manual**: Use o menu "EmpregaJá" na planilha
- **Monitoramento**: Acesse a planilha de logs ou o dashboard do site

### Comandos Disponíveis

- `configurarAutomacao()` - Ativa o sistema
- `removerAutomacao()` - Desativa o sistema
- `coletarNetEmpregos()` - Coleta manual Net-Empregos
- `coletarJobartis()` - Coleta manual Jobartis
- `listarTriggers()` - Ver triggers ativos
- `enviarRelatorioDiario()` - Enviar relatório por email

---

## 📝 Próximos Passos

1. **Testar manualmente** primeiro com `coletarNetEmpregos()`
2. **Verificar logs** na planilha
3. **Ajustar scrapers** conforme necessário
4. **Ativar automação** com `configurarAutomacao()`
5. **Monitorar** os emails e a planilha

## ⚠️ Importante

- Você PRECISA adaptar os scrapers para a estrutura real dos sites
- Teste sempre manualmente antes de automatizar
- Verifique se os sites permitem scraping (termos de uso)
- Configure seu email em `Config.gs`
