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

## Atualização de 20/08/2026 (à noite) — Painel Administrativo

Depois da revisão inicial, o Luciano pediu a construção de um **Painel Administrativo** para a Kerllen gerenciar Devocionais, Livros e Mídias sem mexer na planilha. Isso resolveu, de vez, os dois pontos de atenção listados acima:

### 3. "Conteúdo que ainda não é lido pelo site" → agora está resolvido

O `index.html` passou a buscar Devocionais/Livros/Mídias/Configurações de verdade na planilha (só os itens marcados "Publicado"). O painel (`admin.html`) é a tela onde a Kerllen cadastra esse conteúdo — incluindo links (PDF, vídeo, compra) e imagens (por URL). **Lição:** o "próximo passo" documentado num `ESPECIFICACAO.md` não é perdido — ele guia exatamente o que construir depois.

### 4. "Backend não versionado" → parcialmente resolvido (um segundo backend, esse sim versionado)

Como não havia acesso de edição ao projeto Apps Script original da Kerllen (só à planilha), a solução foi publicar um **segundo backend**, numa conta diferente (Luciano), vinculado à MESMA planilha — e esse sim com o código guardado no repositório (`backend.gs` e `apps-script/`). O backend original da Kerllen continua intacto, cuidando só dos formulários públicos.

**Lição para a Kerllen:** ter dois backends para o mesmo site funciona, mas não é o ideal a longo prazo — o ideal é ela dar acesso de edição do projeto Apps Script dela para quem for ajudar a manter o sistema, para existir só UM backend, mais fácil de entender e dar manutenção.

### 5. Senha do painel: por que não fica escrita no código

**O que foi pensado:** se a senha do painel ficasse escrita direto no HTML (`admin.html`), qualquer pessoa que abrisse o código-fonte da página (Ctrl+U no navegador) veria a senha atual.

**Como foi resolvido:** a senha "de verdade" fica guardada nas **Propriedades do Script** do Apps Script — um cofre que existe fora da planilha e fora de qualquer arquivo do site. O código só guarda uma senha PROVISÓRIA, que o painel obriga a trocar no primeiro uso; depois da troca, nem essa senha provisória serve mais para nada.

**Como evitar no futuro:** sempre que um projeto precisar de "senha simples" (sem um sistema de login de verdade), evitar deixar a senha atual escrita em texto puro num arquivo público (HTML/JS que qualquer visitante baixa) — usar algum tipo de armazenamento do lado do servidor, como fizemos aqui.

### 6. Novas colunas na planilha: como foram adicionadas sem risco

Foi preciso guardar a URL de uma imagem para cada Devocional/Livro/Mídia, mas as abas da planilha não tinham essa coluna. **Como foi feito com segurança:** antes de escrever, o script conferiu que a célula do cabeçalho novo (`Imagem_Url`) estava realmente vazia — só então escreveu. Nenhuma coluna existente foi renomeada, movida ou apagada. **Lição:** é seguro ADICIONAR uma coluna nova no fim de uma aba; o que nunca deve ser feito sem necessidade comprovada é renomear ou mover uma coluna que já existe (isso quebra tudo que já lê essa aba).

---

### 7. Teste de ponta a ponta do painel (depois da autorização do Luciano)

Depois que o Luciano autorizou o novo backend (passo manual único, obrigatório em todo Apps Script recém-publicado), foi feito o teste completo pela interface real do painel publicado: login com a senha provisória → troca obrigatória → cadastro de um Devocional, um Livro e uma Mídia (cada um com link e imagem) → conferido na planilha → conferido no site público (imagem carregando, link funcionando, vídeo do YouTube incorporado de verdade) → edição das Configurações do Site (banner, aviso) → conferida no site → tudo removido/restaurado ao final.

**O que apareceu no caminho:**

- **Erro de conexão passageiro:** ao salvar a Mídia de teste, a primeira tentativa deu "Erro de conexão" (instabilidade momentânea entre o navegador e o Google, não um bug do código). O formulário manteve os dados preenchidos e a segunda tentativa (clicar em "Salvar" de novo) funcionou. **Lição:** um erro de conexão isolado nem sempre é bug — vale tentar de novo antes de investigar o código; o importante é que o formulário não perdeu o que a pessoa tinha digitado.
- **Aspas duplicadas no Versículo do Dia:** o texto salvo na planilha já vinha com aspas (`"A mulher que teme..."`), e o `index.html` colocava outro par de aspas por cima, mostrando `""texto""`. **Corrigido** checando se o texto já começa e termina com aspas antes de adicionar. **Lição:** ao formatar visualmente um texto que vem de uma fonte de dados (planilha), sempre checar como esse texto já está formatado — evita "dobrar" pontuação.

**Estado final da senha do painel:** foi restaurada para a **senha provisória `MulherDeFe2026`** com a troca obrigatória ainda pendente — ou seja, o painel está exatamente como a Kerllen vai encontrar da primeira vez que abrir, como se este teste nunca tivesse acontecido. (Isso só foi possível apagando, ao final, uma ação especial de "restaurar senha" que foi adicionada só para o teste e removida do código logo depois — nunca ficou publicada por mais tempo que o necessário.)

---

## Atualização de 20/08/2026 (noite, parte 2) — Livro sumido, download que não baixava, Temas e Estatísticas

A Kerllen já estava usando o painel de verdade (trocou a senha provisória pela dela mesma e cadastrou o livro "30 gatilhos mentais") quando apareceram dois relatos de bug reais dela, mais dois pedidos de funcionalidade nova.

### 8. "Cadastrei um livro e ele não aparece no site"

**O que era:** o registro do livro na planilha estava **perfeito** — todos os campos no lugar certo, nada torto ou deslocado. O problema era só um: o campo de status ficou em **"Rascunho"** (o padrão de todo item novo), e o site só mostra itens marcados **"Publicado"**.

**Sintoma:** livro cadastrado certinho, mas invisível no site — parecia um bug de gravação ou de leitura, mas era só um passo esquecido.

**Correção:** o registro dela foi corrigido diretamente (status trocado para "Publicado" — **a linha dela não foi apagada nem recriada**, só esse um campo mudou). Além disso, o campo de visibilidade no formulário do painel ficou bem mais chamativo: agora são dois botões grandes ("Rascunho"/"Publicado") com um aviso em destaque, em vez de uma caixinha de seleção discreta fácil de ignorar.

**Como evitar no futuro:** sempre que um sistema tiver um "modo rascunho", o campo que controla isso precisa ser a coisa mais visível da tela de edição — é o tipo de esquecimento que qualquer pessoa comete, não só quem está aprendendo.

### 9. "Diz que baixou, mas não baixa nada, e não chega e-mail"

**O que era, na real, TRÊS problemas diferentes empilhados:**
1. O botão genérico "Baixar Devocional Gratuito" (do topo do site) nunca tinha nenhum arquivo de verdade vinculado a ele — não existia devocional publicado ainda, então não tinha o que abrir.
2. Quando existia um arquivo, o código tentava abrir a nova aba **depois** de esperar a resposta do servidor (`await`) — e navegadores costumam bloquear a abertura de uma aba nova quando isso acontece "tarde demais" depois do clique da pessoa (chamado de bloqueio de pop-up).
3. O texto da tela prometia "receber o PDF no seu e-mail" — mas **nenhum dos dois backends deste site nunca implementou envio de e-mail**. Era uma promessa que o código nunca cumpria.

**Decisão tomada (a pedido da Kerllen):** em vez de tentar implementar envio de e-mail de verdade (mais complexo, sujeito a cair no spam, com limite diário de envios), a entrega passou a ser **imediata**: a pessoa se identifica uma vez (nome + e-mail), e o arquivo abre na hora numa nova aba, no visualizador do Google Drive — que já tem seu próprio botão de baixar. Da segunda vez em diante, o navegador "lembra" quem já se identificou (guardado no aparelho da pessoa, não em nenhum servidor) e abre direto.

**Correção técnica:** o código passou a abrir o arquivo **antes** de chamar o servidor (não depois), o que evita o bloqueio de pop-up; todos os textos que prometiam e-mail foram reescritos para descrever o que realmente acontece.

**Como evitar no futuro:** nunca escrever num texto de tela algo que o código não faz de verdade ("vamos te enviar por e-mail" só vale se existir, de fato, uma linha de código que manda e-mail). E: ações que abrem uma nova aba/janela em resposta a um clique devem acontecer o mais rápido possível, antes de qualquer espera de rede — senão o navegador pode barrar.

### 10. Dois recursos novos: Temas de campanha e Estatísticas

A pedido do Luciano/Kerllen, foram criados:
- **Aba "Aparência/Tema"** no painel: troca as cores do site (Agosto Lilás, Setembro Amarelo, Outubro Rosa, Novembro Azul, ou cores personalizadas), logotipo e uma faixa de mensagem de campanha — sem precisar mexer em código, só clicando.
- **Aba "Estatísticas"**: visitas, downloads, assinantes e cliques em mídia, com filtro de período e rankings dos itens mais acessados.

**Detalhe técnico que vale a pena entender:** as cores do site usam "variáveis CSS" — como se fossem caixinhas nomeadas (`--cor-oliva`, `--cor-dourado`...) que todo o site usa. Trocar o CONTEÚDO dessas caixinhas muda a cor em tudo, na hora, sem precisar editar cada botão/título um por um.

### 11. Bug encontrado no teste: números da aba Estatísticas zerados no filtro de período

**O que era:** ao testar a aba Estatísticas, o total geral mostrava certo (ex.: "2 downloads"), mas os filtros "7 dias" e "30 dias" mostravam **0** — mesmo para coisas que tinham acabado de acontecer.

**Causa:** o backend original da Kerllen (que grava quem baixou o quê) usa um fuso horário ligeiramente diferente do backend novo (que soma os números). Isso fazia alguns registros parecerem "gravados no futuro" por alguns minutos — e o cálculo de período tinha uma regra rígida demais ("só conta se não for do futuro"), que descartava esses registros.

**Correção:** o cálculo passou a ignorar se a diferença é "passado" ou "futuro" e olhar só o tamanho da diferença — assim, pequenas divergências de fuso entre os dois backends não fazem mais nenhum registro sumir da contagem.

**Como evitar no futuro:** quando dois sistemas diferentes gravam datas/horas que depois são comparadas entre si, nunca assumir que os relógios/fusos batem perfeitamente — sempre que possível, usar uma comparação tolerante (diferença absoluta) em vez de uma regra rígida de "antes/depois".

---

*Documento criado como parte do processo padrão de entrega dos projetos da Turma 2 IA na Prática. Serve como material de estudo — não é preciso entender de programação para ler; cada item explica o problema com uma comparação do dia a dia.*
