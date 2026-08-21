# Correções e Lições — Mulher de Fé

Este documento é para a Kerllen (dona do projeto) aprender com a revisão feita no dia 20/08/2026. Diferente de outros projetos da turma, aqui a notícia boa é: **o formulário já estava gravando de verdade na planilha antes mesmo desta revisão.** Mesmo assim, valeu a pena revisar com calma — e apareceu um ponto de atenção real que vale a pena corrigir.

A lição de sempre, válida também quando está tudo certo: **a tela dizer "sucesso" não prova nada sozinha — só a linha aparecendo na planilha prova.** Por isso todo teste feito aqui foi conferido direto na planilha, com um nome marcado como "TESTE-E2E", e depois apagado.

---

## O que foi conferido e já estava certo (parabéns por isso)

Comparando com os erros clássicos que aparecem nos outros projetos da turma, o `index.html` da Mulher de Fé já acertava em tudo isso:

- **Endereço da API no formato certo:** `https://script.google.com/macros/s/<ID>/exec` — é o único formato que funciona para receber pedidos do navegador.
- **`fetch` com as opções certas do navegador:** usa `body:` (não `payload:`, que é de outra linguagem) e `Content-Type: text/plain`, que evita uma checagem extra do navegador (chamada "preflight") que o Google não sabe responder.
- **Nomes de aba e coluna batendo exatamente com a planilha:** `Leads_Devocionais` e `Newsletter`, com os mesmos nomes de coluna que o backend espera — inclusive letras maiúsculas/minúsculas e sublinhados.
- **Nenhum dado da planilha é jogado dentro de `onclick="..."`** (não há sequer leitura de dados da planilha na página hoje, então esse risco de invasão nem existe ainda).
- **Botões travam durante o envio** (`btn.disabled = true`) e mostram um ícone de carregando, evitando cadastro duplicado por clique duplo.

## Testes feitos (a prova de que funciona)

1. **Chamada direta na API** (sem passar pelo site) com um lead de teste e um e-mail de newsletter de teste → os dois apareceram na planilha em poucos segundos.
2. **Pelo site publicado de verdade**, usando um navegador automatizado (Playwright): abri o site no ar, cliquei em "Baixar Devocional Gratuito", preenchi Nome e E-mail, enviei — a tela mostrou "Sucesso" e a linha apareceu na aba `Leads_Devocionais` da planilha, com o nome exatamente como digitado.
3. Depois de cada teste, as linhas marcadas como teste foram apagadas da planilha (planilha compartilhada é ambiente de produção — não pode ficar com lixo de teste misturado com dados reais).

## Ponto de atenção real encontrado (não é bug, é risco)

### 1. O código do backend (Apps Script) não está guardado em lugar nenhum do GitHub

**O que é:** o site chama uma API do Google (Apps Script) que está publicada e funcionando, mas o código-fonte dela — o arquivo que decide "o que fazer quando alguém envia o formulário" — só existe dentro do projeto do Google Apps Script da Kerllen. Ele nunca foi copiado para dentro do repositório `Mulher-de-f-` no GitHub.

**Por que isso é um risco (mesmo funcionando hoje):** se um dia for preciso mudar alguma coisa no backend (por exemplo, adicionar um campo novo no formulário), não existe um "antes e depois" salvo no GitHub para comparar, nem uma cópia de segurança fora do Google. Se o projeto do Apps Script for apagado ou perder permissão por acidente, o código se perde — só a planilha continua existindo.

**Como evitar no futuro:** sempre que um backend do Apps Script for criado ou alterado, copiar o código para dentro do repositório do GitHub também (um arquivo tipo `backend.gs`), do mesmo jeito que os outros projetos da turma fazem. Isso também ajuda quem for dar manutenção depois a entender o sistema sem precisar abrir o Google Apps Script.

*Esta revisão não alterou o backend nem a URL da API, porque não havia acesso de edição ao projeto do Apps Script (só à planilha) e, principalmente, porque **não havia nada quebrado para justificar mexer** — seguindo a regra de não tocar em algo que já funciona sem necessidade comprovada.*

### 2. Conteúdo da planilha que ainda não é lido pelo site

**O que é:** a planilha tem abas prontas (`Conteudo_Devocionais`, `Conteudo_Livros`, `Conteudo_Midias`, `Configuracoes_Site`) pensadas para alimentar as seções do site, mas o `index.html` nunca faz uma leitura (`GET`) nelas — todo o conteúdo dessas seções é texto fixo escrito direto no HTML.

**Sintoma, se alguém não souber disso:** a Kerllen pode preencher essas abas esperando que o site mude sozinho, e ficar sem entender por que nada muda na página.

**Como evitar confusão:** documentado aqui e no `ESPECIFICACAO.md` como próximo passo do projeto, não como bug — construir essa ligação é a evolução natural (o "banco" já está pronto, falta só o site ir buscar).

---

## Boas práticas que já estavam certas (e vale manter)

- Testar sempre com um registro marcado como teste e depois apagá-lo — nunca deixar "lixo de teste" misturado com dados reais na planilha.
- Usar `text/plain` no `Content-Type` do `fetch` para não esbarrar na checagem de CORS que o Apps Script não responde.
- Travar o botão durante o envio para evitar cadastro duplicado.

---

*Documento criado como parte do processo padrão de entrega dos projetos da Turma 2 IA na Prática. Serve como material de estudo — não é preciso entender de programação para ler; cada item explica o problema com uma comparação do dia a dia.*
