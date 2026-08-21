# Especificação do Sistema — Mulher de Fé

> Atualizada em 20/08/2026: adicionado o Painel Administrativo (gerencia Devocionais, Livros e Mídias) e as seções do site público passaram a ler esse conteúdo direto da planilha.

**Nome do projeto:** Mulher de Fé

**Problema que resolve:** Página de divulgação (landing page) de conteúdo devocional cristão, com captura de contatos (quem quer baixar o devocional gratuito, e quem quer assinar a newsletter) e um painel para a Kerllen gerenciar o conteúdo do site (devocionais, livros, mídias, textos e banner) sem precisar mexer direto na planilha.

**Público:** visitantes do site (público) + Kerllen, dona do projeto (painel administrativo) — projeto didático da Turma 2 IA na Prática.

**O sistema em uma frase:** Um site (`index.html`) que lê e grava numa planilha Google através de DOIS backends Apps Script diferentes, e um painel (`admin.html`) protegido por senha para gerenciar o conteúdo.

---

## Arquitetura (como funciona)

```
                    ┌─────────────────────────────┐
                    │   Planilha "Banco de Dados   │
                    │        Mulheres de Fé"       │
                    └───────────────┬─────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                             │
┌───────▼────────┐          ┌────────▼─────────┐                   │
│ Backend ORIGINAL │          │ Backend do PAINEL │                  │
│ (da Kerllen,     │          │ (novo, publicado   │                  │
│ código não está   │          │ pelo Luciano — código│                │
│ no repositório)   │          │ em backend.gs)      │                 │
│ só recebe leads/  │          │ CRUD de conteúdo +  │                 │
│ newsletter        │          │ leitura de leads    │                 │
└───────▲────────┘          └────────▲─────────┘                   │
        │ POST (leads/newsletter)     │ GET (público, sem senha)     │
        │                              │ POST (painel, COM senha)     │
┌───────┴──────────────────────────────┴─────────────────────────┐
│                        index.html (site público)                 │
│         admin.html (painel — pede senha para entrar)            │
└───────────────────────────────────────────────────────────────┘
```

- **Site público:** https://kerllenmaia-code.github.io/Mulher-de-f-/
- **Painel administrativo:** https://kerllenmaia-code.github.io/Mulher-de-f-/admin.html
- **Backend original** (recebe os 2 formulários públicos): continua exatamente como estava, sem alteração. Código não está neste repositório (só existe no projeto Apps Script da Kerllen).
- **Backend do painel** (novo, publicado pelo Luciano): código-fonte em `backend.gs` (raiz do repo) e `apps-script/backend.js` (cópia usada pelo `clasp` para publicar). Vinculado à MESMA planilha da Kerllen.
  URL: `https://script.google.com/macros/s/AKfycbxFE10E5VzbLBKl116ZhvBRDXCqEmoztSbCapIZD2D4zTYosc4uFT4YFXcIk1Ai8IoUMg/exec`
- **Banco de dados:** planilha "Banco de Dados Mulheres de Fé" (ID `1WvTjCKAtO1QSZ3ciFYepvnxlOmkKL9A608jwvdZQjug`), de propriedade de `kerllenmaia@gmail.com`, compartilhada com Luciano.

### Arquivos do repositório

| Arquivo | Papel |
|---|---|
| `index.html` | Site público: conteúdo + formulários + leitura dinâmica de Devocionais/Livros/Mídias/Configurações |
| `admin.html` | Painel administrativo (senha obrigatória) — CRUD de conteúdo + visualização de leads |
| `backend.gs` | Código-fonte do backend do painel (Apps Script) — fonte da verdade |
| `apps-script/` | Projeto `clasp` (manifesto do Web App + cópia publicada `backend.js` + `.clasp.json`) |

---

## Painel Administrativo (`admin.html`)

### Acesso e senha
- Login com senha simples. **Primeiro acesso obriga a trocar a senha provisória** — o painel não deixa continuar sem definir uma senha nova (mínimo 6 caracteres).
- A senha atual fica guardada nas **Propriedades do Script** do Apps Script (um cofre próprio do projeto, fora da planilha e fora do código) — não fica mais escrita em nenhum arquivo depois da troca.
- Toda ação de escrita no backend também exige a senha (não é só a tela do painel que "tranca" — o servidor confere de novo).
- Isto é uma proteção **simples**, do nível de um projeto de aula — não é segurança de verdade para dados sensíveis (a senha viaja em texto puro na chamada à API).

### O que dá para gerenciar
- **Devocionais**: título, categoria, tempo de leitura, resumo, conteúdo completo (opcional), link do PDF, imagem do card, status (Rascunho/Publicado).
- **Livros**: título, subtítulo, selo de destaque, descrição, preço, link de pagamento, link de amostra, capa (imagem), status.
- **Mídias**: título, tipo (podcast/vídeo), categoria, duração, descrição, link do arquivo/vídeo (YouTube é exibido incorporado no site), imagem de capa, status.
- **Leads do Devocional** e **Newsletter**: só leitura — lista de quem se cadastrou pelo site.
- **Configurações do Site**: imagem de banner do topo, aviso da barra do topo, texto e referência do versículo do dia.
- "Remover" é sempre **soft delete** (status vira "Removido") — nunca apaga a linha da planilha.

## Site público (`index.html`) — o que mudou

As seções de Devocionais, Livros e Mídias agora **leem de verdade a planilha** (só itens com status "Publicado"; rascunhos nunca aparecem no site):
- Cada devocional no site tem seu próprio botão "Baixar PDF Completo" — ao preencher o formulário, o PDF específico daquele devocional abre em nova aba.
- Livros mostram capa, preço e os links de pagamento/amostra cadastrados no painel.
- Mídias com link do YouTube aparecem com o **vídeo incorporado**; as demais mostram um botão "Ouvir/Assistir" que abre o link.
- Se a Kerllen ainda não publicou nada em alguma seção, aparece uma mensagem simpática ("em breve") em vez de erro ou tela vazia.
- O banner do topo (imagem de fundo do herói), o aviso da barra verde e o versículo do dia também vêm da planilha (aba `Configuracoes_Site`) quando preenchidos no painel.

---

## Banco de dados (planilha)

| Aba | Colunas |
|---|---|
| `Leads_Devocionais` | ID, Data_Hora, Nome, Email, Nome_Devocional_Baixado, Status_Envio |
| `Newsletter` | ID, Data_Hora, Email, Status_Inscricao |
| `Conteudo_Devocionais` | ID, Status_Publicacao, Data_Publicacao, Categoria, Tempo_Leitura_Min, Titulo, Resumo, Conteudo_Completo_HTML, Link_PDF, **Imagem_Url** |
| `Conteudo_Livros` | ID, Status, Selo_Destaque, Titulo, Subtitulo, Descricao, Preco, Link_Pagamento, Link_Amostra, **Imagem_Url** |
| `Conteudo_Midias` | ID, Status, Tipo_Midia, Categoria_Selo, Titulo, Duracao, Descricao, Link_Arquivo_Url, **Imagem_Url** |
| `Configuracoes_Site` | Chave, Valor, Descricao_Uso |
| `Página1` | aba padrão criada pelo Google Sheets, sem uso |

**Colunas novas nesta revisão:** `Imagem_Url` foi adicionada ao final das três abas de conteúdo (só isso — nenhum cabeçalho existente foi renomeado ou movido). Nada foi apagado.

---

## API do backend do painel (`backend.gs`)

Leituras públicas (GET, sem senha — só devolvem itens "Publicado"): `getDevocionaisPublicados`, `getLivrosPublicados`, `getMidiasPublicadas`, `getConfiguracoesPublicas`, `ping`.

Ações do painel (POST, **exigem `senha`** no corpo da requisição): `verificarSenha`, `trocarSenha`, `listarDevocionais`/`addDevocional`/`updateDevocional`/`deleteDevocional` (e equivalentes para Livros/Mídias), `listarConfiguracoes`/`updateConfiguracao`, `listarLeads`, `listarNewsletter` (as duas últimas só leitura).

### Como atualizar o backend do painel (deploy via clasp)

```
cp backend.gs apps-script/backend.js
cd apps-script
clasp push -f
clasp create-version "descrição da mudança"
clasp update-deployment AKfycbxFE10E5VzbLBKl116ZhvBRDXCqEmoztSbCapIZD2D4zTYosc4uFT4YFXcIk1Ai8IoUMg -V <nº da versão>
```
A URL pública não muda entre versões.

---

## Segurança e LGPD

- Os dois backends são **públicos e sem login real** (`ANYONE_ANONYMOUS`) — padrão dos projetos da turma. A leitura pública de conteúdo (Devocionais/Livros/Mídias/Configurações) não expõe dado pessoal nenhum. As ações administrativas exigem senha; a listagem de leads/newsletter (que TEM dados pessoais: nome e e-mail) só é acessível com a senha do painel.
- Ainda assim, a senha viaja em texto puro e não é uma autenticação "de verdade" (não é OAuth, não expira, é uma senha só). **Aceitável para fins de aula**; antes de usar com dados reais de público em massa, recomenda-se uma autenticação mais forte.
- Os dados coletados pelos formulários (nome e e-mail de quem baixa o devocional/assina a newsletter) são dados pessoais reais assim que o site for divulgado — vale cuidado antes de compartilhar o link amplamente.

---

## Roteiro de evolução sugerido (não implementado)

- Autenticação mais forte para o painel (hoje é senha simples).
- Editor de conteúdo mais rico para `Conteudo_Completo_HTML` do devocional (hoje é um campo de texto simples).
- Unificar os dois backends num só (hoje existem dois Apps Scripts separados porque o Luciano não tinha acesso de edição ao projeto original da Kerllen — ver `CORRECOES_E_LICOES.md`).
