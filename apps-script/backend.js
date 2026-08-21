/**
 * Mulher de Fé — Backend do Painel Administrativo (Google Apps Script)
 * Gerencia o conteúdo do site (Devocionais, Livros, Mídias) e permite ver
 * (só leitura) os leads capturados pelos formulários do site público.
 *
 * Database: Google Sheets "Banco de Dados Mulheres de Fé"
 * (1WvTjCKAtO1QSZ3ciFYepvnxlOmkKL9A608jwvdZQjug)
 *
 * IMPORTANTE: este é um SEGUNDO backend, publicado à parte do backend
 * original da aluna (que continua recebendo os formulários do site em
 * outra URL). Este aqui só cuida do conteúdo (Devocionais/Livros/Mídias)
 * e da leitura dos leads para o painel administrativo — não escreve nada
 * nas abas Leads_Devocionais/Newsletter.
 */

// ==================== CONFIGURAÇÕES ====================
const SPREADSHEET_ID = "1WvTjCKAtO1QSZ3ciFYepvnxlOmkKL9A608jwvdZQjug";

const SHEET_DEVOCIONAIS = "Conteudo_Devocionais";
const SHEET_LIVROS = "Conteudo_Livros";
const SHEET_MIDIAS = "Conteudo_Midias";
const SHEET_LEADS = "Leads_Devocionais";
const SHEET_NEWSLETTER = "Newsletter";
const SHEET_CONFIG = "Configuracoes_Site";
const SHEET_ESTATISTICAS = "Estatisticas";

/**
 * Senha PROVISÓRIA do painel administrativo — só vale antes da primeira
 * troca. Depois que a Kerllen definir a senha dela, esta constante deixa
 * de valer: a senha real fica guardada nas "Propriedades do Script"
 * (PropertiesService, um cofre próprio de cada projeto do Apps Script,
 * fora da planilha e fora do código-fonte), então quem olhar o código
 * não vê mais a senha atual.
 *
 * Isto ainda é uma proteção SIMPLES (afasta curiosos), não é segurança
 * "de verdade" — a senha viaja em texto puro na chamada à API. Serve
 * para o nível de um projeto de aula, não para dados sensíveis de gente
 * real em produção.
 */
const SENHA_PROVISORIA = "MulherDeFe2026";

function getPropriedades() {
  return PropertiesService.getScriptProperties();
}

/**
 * Devolve a senha atual (a definida pela Kerllen, ou a provisória se ela
 * ainda não trocou). Inicializa as propriedades na primeira chamada.
 */
function getSenhaAtual() {
  const props = getPropriedades();
  let senha = props.getProperty("admin_senha");
  if (!senha) {
    senha = SENHA_PROVISORIA;
    props.setProperty("admin_senha", senha);
    props.setProperty("admin_troca_pendente", "true");
  }
  return senha;
}

function trocaPendente() {
  const props = getPropriedades();
  getSenhaAtual(); // garante que já foi inicializada
  return props.getProperty("admin_troca_pendente") !== "false";
}

// ==================== UTILS & HELPERS ====================
// (mesmo padrão usado no OdontoSys — Susysvm/OdontoSys/backend.gs)

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Linha "vazia de verdade": só células em branco ou checkbox desmarcado.
 */
function isRowEmpty(row) {
  return row.every(function (cell) { return cell === "" || cell === false; });
}

function sheetToJson(sheetName) {
  const sheet = getSheet(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();

  if (values.length === 0) return [];

  const headers = values[0];
  const data = [];

  for (let i = 1; i < values.length; i++) {
    if (isRowEmpty(values[i])) continue;
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = normalizarCelulaData(values[i][j]);
    }
    data.push(row);
  }

  return data;
}

/**
 * Se for objeto Date, converte para texto pt-BR (dd/mm/aaaa ou HH:mm,
 * dependendo do ano). Demais tipos seguem inalterados.
 */
function normalizarCelulaData(v) {
  if (!(v instanceof Date)) return v;
  if (v.getFullYear() <= 1900) {
    return Utilities.formatDate(v, "America/Manaus", "HH:mm");
  }
  return Utilities.formatDate(v, "America/Manaus", "dd/MM/yyyy HH:mm");
}

/**
 * Adiciona uma linha na primeira posição realmente livre (não confia em
 * appendRow porque colunas de checkbox preenchem a grade toda com FALSE).
 */
function addRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();

  if (values.length === 0 || isRowEmpty(values[0])) {
    const keys = Object.keys(data);
    sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
    sheet.getRange(2, 1, 1, keys.length).setValues([keys.map(function (k) { return data[k]; })]);
    return { success: true, message: "Registro adicionado com sucesso" };
  }

  const headers = values[0];
  const row = headers.map(function (h) {
    return data[h] !== undefined ? data[h] : "";
  });

  let lastRow = 1;
  for (let i = 1; i < values.length; i++) {
    if (!isRowEmpty(values[i])) lastRow = i + 1;
  }

  sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
  return { success: true, message: "Registro adicionado com sucesso" };
}

function updateRow(sheetName, id, data) {
  const sheet = getSheet(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();

  if (values.length === 0) {
    return { success: false, error: "Nenhum dado encontrado" };
  }

  const headers = values[0];
  const idIndex = headers.indexOf("ID");
  if (idIndex === -1) {
    return { success: false, error: "Coluna ID não encontrada" };
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      for (let j = 0; j < headers.length; j++) {
        if (data[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(data[headers[j]]);
        }
      }
      return { success: true, message: "Registro atualizado com sucesso" };
    }
  }

  return { success: false, error: "Registro não encontrado" };
}

/**
 * Próximo ID numérico sequencial (coluna "ID") de uma aba.
 */
function proximoIdNumerico(sheetName) {
  const registros = sheetToJson(sheetName);
  let maior = 0;
  registros.forEach(function (r) {
    const n = parseInt(r.ID, 10);
    if (!isNaN(n) && n > maior) maior = n;
  });
  return maior + 1;
}

function hojeBR() {
  return Utilities.formatDate(new Date(), "America/Manaus", "dd/MM/yyyy HH:mm");
}

function senhaValida(data) {
  return !!data && typeof data.senha === "string" && data.senha === getSenhaAtual();
}

function respostaSemPermissao() {
  return { success: false, error: "Senha inválida ou ausente" };
}

// ==================== ENDPOINTS HTTP ====================

/**
 * GET: só as leituras PÚBLICAS (sem senha) usadas pelo site — devolve
 * apenas os itens com status "Publicado", nunca rascunhos.
 */
function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || "";
    let response;

    switch (action) {
      case "getDevocionaisPublicados":
        response = { success: true, data: publicados(sheetToJson(SHEET_DEVOCIONAIS), "Status_Publicacao") };
        break;
      case "getLivrosPublicados":
        response = { success: true, data: publicados(sheetToJson(SHEET_LIVROS), "Status") };
        break;
      case "getMidiasPublicadas":
        response = { success: true, data: publicados(sheetToJson(SHEET_MIDIAS), "Status") };
        break;
      case "getConfiguracoesPublicas":
        response = { success: true, data: configComoMapa() };
        break;
      case "ping":
        response = { success: true, message: "Backend do painel Mulher de Fé rodando e ativo!" };
        break;
      default:
        response = { success: false, error: "Ação não reconhecida (ou requer senha — use POST)" };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function publicados(lista, coluna) {
  return lista.filter(function (item) {
    return String(item[coluna] || "").trim() === "Publicado";
  });
}

function configComoMapa() {
  const linhas = sheetToJson(SHEET_CONFIG);
  const mapa = {};
  linhas.forEach(function (l) { mapa[l.Chave] = l.Valor; });
  return mapa;
}

/**
 * POST: a maioria das ações é do PAINEL ADMINISTRATIVO e exige
 * data.senha === getSenhaAtual() (verificado logo no início). A exceção
 * é "registrarEvento" — precisa ser chamável por QUALQUER visitante do
 * site anônimo (não passa por senha), mas só grava um evento simples
 * (tipo + item), sem nenhum dado pessoal.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || "";

    if (action === "registrarEvento") {
      return ContentService.createTextOutput(JSON.stringify(handleRegistrarEvento(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!senhaValida(data)) {
      return ContentService.createTextOutput(JSON.stringify(respostaSemPermissao()))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let response;

    switch (action) {
      // ---- Estatísticas ----
      case "getResumoEstatisticas":
        response = handleGetResumoEstatisticas();
        break;

      // ---- Login / senha ----
      case "verificarSenha":
        response = { success: true, trocaPendente: trocaPendente() };
        break;
      case "trocarSenha":
        response = handleTrocarSenha(data);
        break;

      // ---- Configurações do site (versículo, aviso, banner) ----
      case "listarConfiguracoes":
        response = { success: true, data: sheetToJson(SHEET_CONFIG) };
        break;
      case "updateConfiguracao":
        response = handleUpdateConfiguracao(data);
        break;

      // ---- Devocionais ----
      case "listarDevocionais":
        response = { success: true, data: sheetToJson(SHEET_DEVOCIONAIS) };
        break;
      case "addDevocional":
        response = handleAddDevocional(data);
        break;
      case "updateDevocional":
        response = handleUpdateDevocional(data);
        break;
      case "deleteDevocional":
        response = updateRow(SHEET_DEVOCIONAIS, data.id, { Status_Publicacao: "Removido" });
        break;

      // ---- Livros ----
      case "listarLivros":
        response = { success: true, data: sheetToJson(SHEET_LIVROS) };
        break;
      case "addLivro":
        response = handleAddLivro(data);
        break;
      case "updateLivro":
        response = handleUpdateLivro(data);
        break;
      case "deleteLivro":
        response = updateRow(SHEET_LIVROS, data.id, { Status: "Removido" });
        break;

      // ---- Mídias ----
      case "listarMidias":
        response = { success: true, data: sheetToJson(SHEET_MIDIAS) };
        break;
      case "addMidia":
        response = handleAddMidia(data);
        break;
      case "updateMidia":
        response = handleUpdateMidia(data);
        break;
      case "deleteMidia":
        response = updateRow(SHEET_MIDIAS, data.id, { Status: "Removido" });
        break;

      // ---- Leads / Newsletter (só leitura) ----
      case "listarLeads":
        response = { success: true, data: sheetToJson(SHEET_LEADS) };
        break;
      case "listarNewsletter":
        response = { success: true, data: sheetToJson(SHEET_NEWSLETTER) };
        break;

      default:
        response = { success: false, error: "Ação não reconhecida" };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== HANDLERS - LOGIN / SENHA / CONFIGURAÇÕES ====================

function handleTrocarSenha(data) {
  const nova = (data.novaSenha || "").trim();
  if (nova.length < 6) {
    return { success: false, error: "A nova senha precisa ter pelo menos 6 caracteres" };
  }
  const props = getPropriedades();
  props.setProperty("admin_senha", nova);
  props.setProperty("admin_troca_pendente", "false");
  return { success: true, message: "Senha alterada com sucesso" };
}

/**
 * Grava/atualiza uma linha da aba Configuracoes_Site (upsert por Chave).
 * Colunas reais: Chave, Valor, Descricao_Uso
 */
function handleUpdateConfiguracao(data) {
  const chave = data.chave;
  const valor = data.valor !== undefined ? data.valor : "";
  if (!chave) return { success: false, error: "Chave obrigatória" };

  const sheet = getSheet(SHEET_CONFIG);
  let values = sheet.getDataRange().getValues();

  if (values.length === 0 || isRowEmpty(values[0])) {
    sheet.getRange(1, 1, 1, 3).setValues([["Chave", "Valor", "Descricao_Uso"]]);
    values = sheet.getDataRange().getValues();
  }

  const headers = values[0];
  const idxChave = headers.indexOf("Chave");
  const idxValor = headers.indexOf("Valor");
  const idxDesc = headers.indexOf("Descricao_Uso");

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idxChave]) === String(chave)) {
      sheet.getRange(i + 1, idxValor + 1).setValue(valor);
      return { success: true, message: "Configuração atualizada" };
    }
  }

  const novaLinha = headers.map(function (h) {
    if (h === "Chave") return chave;
    if (h === "Valor") return valor;
    if (h === "Descricao_Uso") return data.descricao || "";
    return "";
  });
  let lastRow = 1;
  for (let i = 1; i < values.length; i++) {
    if (!isRowEmpty(values[i])) lastRow = i + 1;
  }
  sheet.getRange(lastRow + 1, 1, 1, novaLinha.length).setValues([novaLinha]);
  return { success: true, message: "Configuração criada" };
}

// ==================== HANDLERS - ESTATÍSTICAS ====================
// Aba "Estatisticas": ID, Data_Hora, Tipo_Evento, Item
// Tipos de evento aceitos: "visita" (1 por sessão, Item vazio) e "media"
// (reprodução/clique de mídia, Item = título da mídia). Downloads de
// Devocionais/Livros NÃO duplicam gravação aqui — são contados a partir
// da coluna Nome_Devocional_Baixado da aba Leads_Devocionais, que já é
// preenchida pelo fluxo de identificação do site a cada acesso.

function handleRegistrarEvento(data) {
  const tipo = String(data.tipo || "").trim();
  if (["visita", "media"].indexOf(tipo) === -1) {
    return { success: false, error: "Tipo de evento inválido" };
  }
  const evento = {
    ID: proximoIdNumerico(SHEET_ESTATISTICAS),
    Data_Hora: hojeBR(),
    Tipo_Evento: tipo,
    Item: String(data.item || "").trim()
  };
  return addRow(SHEET_ESTATISTICAS, evento);
}

/**
 * Lê uma data no formato "dd/MM/aaaa HH:mm" ou "dd/MM/aaaa HH:mm:ss"
 * (formatos usados pelos dois backends deste site) e devolve um Date, ou
 * null se não for possível interpretar.
 */
function parseDataBR(texto) {
  if (!texto) return null;
  const m = String(texto).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[ ,T]?(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]), Number(m[6] || 0));
}

function contarPorPeriodo(lista, campoData) {
  const agora = new Date();
  function dentroDe(item, dias) {
    const d = parseDataBR(item[campoData]);
    if (!d) return false;
    // Usa valor absoluto (não só "diferença >= 0"): o backend ORIGINAL da
    // Kerllen (que grava Leads_Devocionais/Newsletter) pode estar
    // configurado num fuso ligeiramente diferente do fuso deste backend
    // (America/Manaus), fazendo alguns registros parecerem "no futuro" por
    // minutos/poucas horas — sem essa tolerância, eles somem do período
    // mesmo tendo acabado de acontecer.
    const diffMs = Math.abs(agora - d);
    return diffMs <= dias * 24 * 60 * 60 * 1000;
  }
  return {
    dias7: lista.filter(function (x) { return dentroDe(x, 7); }).length,
    dias30: lista.filter(function (x) { return dentroDe(x, 30); }).length,
    total: lista.length
  };
}

function rankingPorItem(lista, campoItem, limite) {
  const contagem = {};
  lista.forEach(function (x) {
    const item = String(x[campoItem] || "").trim();
    if (!item) return;
    contagem[item] = (contagem[item] || 0) + 1;
  });
  return Object.keys(contagem)
    .map(function (item) { return { item: item, total: contagem[item] }; })
    .sort(function (a, b) { return b.total - a.total; })
    .slice(0, limite || 10);
}

function handleGetResumoEstatisticas() {
  const eventos = sheetToJson(SHEET_ESTATISTICAS);
  const leads = sheetToJson(SHEET_LEADS);
  const newsletter = sheetToJson(SHEET_NEWSLETTER);

  const visitas = eventos.filter(function (e) { return e.Tipo_Evento === "visita"; });
  const midiaEventos = eventos.filter(function (e) { return e.Tipo_Evento === "media"; });

  return {
    success: true,
    visitas: contarPorPeriodo(visitas, "Data_Hora"),
    downloads: contarPorPeriodo(leads, "Data_Hora"),
    newsletter: contarPorPeriodo(newsletter, "Data_Hora"),
    midiaPlays: contarPorPeriodo(midiaEventos, "Data_Hora"),
    rankingDownloads: rankingPorItem(leads, "Nome_Devocional_Baixado", 10),
    rankingMidias: rankingPorItem(midiaEventos, "Item", 10)
  };
}

// ==================== HANDLERS - DEVOCIONAIS ====================
// Colunas reais: ID, Status_Publicacao, Data_Publicacao, Categoria,
// Tempo_Leitura_Min, Titulo, Resumo, Conteudo_Completo_HTML, Link_PDF,
// Imagem_Url

function handleAddDevocional(data) {
  const item = {
    ID: proximoIdNumerico(SHEET_DEVOCIONAIS),
    Status_Publicacao: data.status || "Rascunho",
    Data_Publicacao: hojeBR(),
    Categoria: data.categoria || "",
    Tempo_Leitura_Min: data.tempoLeituraMin || "",
    Titulo: data.titulo || "",
    Resumo: data.resumo || "",
    Conteudo_Completo_HTML: data.conteudoHtml || "",
    Link_PDF: data.linkPdf || "",
    Imagem_Url: data.imagemUrl || ""
  };
  return addRow(SHEET_DEVOCIONAIS, item);
}

function handleUpdateDevocional(data) {
  const campos = {};
  if (data.status !== undefined) campos.Status_Publicacao = data.status;
  if (data.categoria !== undefined) campos.Categoria = data.categoria;
  if (data.tempoLeituraMin !== undefined) campos.Tempo_Leitura_Min = data.tempoLeituraMin;
  if (data.titulo !== undefined) campos.Titulo = data.titulo;
  if (data.resumo !== undefined) campos.Resumo = data.resumo;
  if (data.conteudoHtml !== undefined) campos.Conteudo_Completo_HTML = data.conteudoHtml;
  if (data.linkPdf !== undefined) campos.Link_PDF = data.linkPdf;
  if (data.imagemUrl !== undefined) campos.Imagem_Url = data.imagemUrl;
  return updateRow(SHEET_DEVOCIONAIS, data.id, campos);
}

// ==================== HANDLERS - LIVROS ====================
// Colunas reais: ID, Status, Selo_Destaque, Titulo, Subtitulo, Descricao,
// Preco, Link_Pagamento, Link_Amostra, Imagem_Url

function handleAddLivro(data) {
  const item = {
    ID: proximoIdNumerico(SHEET_LIVROS),
    Status: data.status || "Rascunho",
    Selo_Destaque: data.seloDestaque || "",
    Titulo: data.titulo || "",
    Subtitulo: data.subtitulo || "",
    Descricao: data.descricao || "",
    Preco: data.preco || "",
    Link_Pagamento: data.linkPagamento || "",
    Link_Amostra: data.linkAmostra || "",
    Imagem_Url: data.imagemUrl || ""
  };
  return addRow(SHEET_LIVROS, item);
}

function handleUpdateLivro(data) {
  const campos = {};
  if (data.status !== undefined) campos.Status = data.status;
  if (data.seloDestaque !== undefined) campos.Selo_Destaque = data.seloDestaque;
  if (data.titulo !== undefined) campos.Titulo = data.titulo;
  if (data.subtitulo !== undefined) campos.Subtitulo = data.subtitulo;
  if (data.descricao !== undefined) campos.Descricao = data.descricao;
  if (data.preco !== undefined) campos.Preco = data.preco;
  if (data.linkPagamento !== undefined) campos.Link_Pagamento = data.linkPagamento;
  if (data.linkAmostra !== undefined) campos.Link_Amostra = data.linkAmostra;
  if (data.imagemUrl !== undefined) campos.Imagem_Url = data.imagemUrl;
  return updateRow(SHEET_LIVROS, data.id, campos);
}

// ==================== HANDLERS - MÍDIAS ====================
// Colunas reais: ID, Status, Tipo_Midia, Categoria_Selo, Titulo, Duracao,
// Descricao, Link_Arquivo_Url, Imagem_Url

function handleAddMidia(data) {
  const item = {
    ID: proximoIdNumerico(SHEET_MIDIAS),
    Status: data.status || "Rascunho",
    Tipo_Midia: data.tipoMidia || "",
    Categoria_Selo: data.categoriaSelo || "",
    Titulo: data.titulo || "",
    Duracao: data.duracao || "",
    Descricao: data.descricao || "",
    Link_Arquivo_Url: data.linkArquivoUrl || "",
    Imagem_Url: data.imagemUrl || ""
  };
  return addRow(SHEET_MIDIAS, item);
}

function handleUpdateMidia(data) {
  const campos = {};
  if (data.status !== undefined) campos.Status = data.status;
  if (data.tipoMidia !== undefined) campos.Tipo_Midia = data.tipoMidia;
  if (data.categoriaSelo !== undefined) campos.Categoria_Selo = data.categoriaSelo;
  if (data.titulo !== undefined) campos.Titulo = data.titulo;
  if (data.duracao !== undefined) campos.Duracao = data.duracao;
  if (data.descricao !== undefined) campos.Descricao = data.descricao;
  if (data.linkArquivoUrl !== undefined) campos.Link_Arquivo_Url = data.linkArquivoUrl;
  if (data.imagemUrl !== undefined) campos.Imagem_Url = data.imagemUrl;
  return updateRow(SHEET_MIDIAS, data.id, campos);
}

// ==================== TESTE ====================

function testarAPI() {
  Logger.log("=== Teste API Painel Mulher de Fé ===");
  try {
    const ss = getSpreadsheet();
    Logger.log("OK - Conectado à planilha: " + ss.getName());
    Logger.log("Devocionais: " + sheetToJson(SHEET_DEVOCIONAIS).length);
    Logger.log("Livros: " + sheetToJson(SHEET_LIVROS).length);
    Logger.log("Mídias: " + sheetToJson(SHEET_MIDIAS).length);
    Logger.log("Leads: " + sheetToJson(SHEET_LEADS).length);
  } catch (e) {
    Logger.log("ERRO: " + e.toString());
  }
}
