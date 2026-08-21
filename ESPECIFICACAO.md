# Especificação do Sistema — Mulher de Fé

> Atualizada em 20/08/2026 para refletir o sistema **como ele é hoje** (verificado funcionando de ponta a ponta).

**Nome do projeto:** Mulher de Fé

**Problema que resolve:** Página de divulgação (landing page) de conteúdo devocional cristão, com captura de contatos de duas formas: quem quer baixar o devocional gratuito (nome + e-mail) e quem quer só assinar a newsletter (e-mail).

**Público:** visitantes do site — projeto didático da Turma 2 IA na Prática.

**O sistema em uma frase:** Uma página única (`index.html`), hospedada no GitHub Pages, que envia os dois formulários para uma planilha Google através de uma API Google Apps Script.

---

## Arquitetura (como funciona)

```
Navegador (GitHub Pages)              Google
┌───────────────────┐   HTTPS   ┌──────────────────┐   ┌────────────────────────┐
│ index.html        │ ────────► │ Apps Script       │ ► │ Planilha "Banco de     │
│ (formulários +     │  JSON    │ (Web App /exec,   │   │ Dados Mulheres de Fé"  │
│  JS embutido)      │ ◄──────── │  código não está  │ ◄ │ (7 abas)               │
└───────────────────┘           │  no repositório)  │   └────────────────────────┘
                                 └──────────────────┘
```

- **Site:** https://kerllenmaia-code.github.io/Mulher-de-f-/ (publicado automaticamente pelo GitHub Pages a cada push na branch `main`)
- **Backend:** Google Apps Script publicado como Web App, já existia funcionando antes desta revisão. **O código-fonte do backend não está neste repositório** — ele só existe dentro do projeto do Google Apps Script da aluna (não está versionado no GitHub). Ver pendência no `CORRECOES_E_LICOES.md`.
- **Banco de dados:** planilha "Banco de Dados Mulheres de Fé" (ID `1WvTjCKAtO1QSZ3ciFYepvnxlOmkKL9A608jwvdZQjug`), de propriedade de `kerllenmaia@gmail.com`, compartilhada com Luciano.
- **URL da API usada pelo site (dentro do `index.html`):**
  `https://script.google.com/macros/s/AKfycbw7_I5K4iSZStRcawhrqmo7kiLcMlonbrY1s-FBKZwV1BbHkLL91WPgF7exnAnzx_Cz/exec`

### Arquivos do repositório

| Arquivo | Papel |
|---|---|
| `index.html` | Página única: conteúdo do site + os dois formulários + todo o JavaScript (não há arquivos separados de CSS/JS) |

---

## Funcionalidades confirmadas funcionando (testado em 20/08/2026)

1. **"Baixar Devocional Gratuito"** (botão do topo e do herói) → abre modal → formulário Nome + E-mail → `POST {action: "salvarLeadDevocional", nome, email, nome_devocional}` → grava na aba `Leads_Devocionais`.
2. **Newsletter** (rodapé) → formulário só de E-mail → `POST {action: "salvarNewsletter", email}` → grava na aba `Newsletter`.

Ambos testados de duas formas: por chamada direta à API (`curl`) e pela interface real do site publicado (Playwright), com registro marcado como teste, conferido na planilha, e depois removido.

## O que ainda é só maquete (não está ligado a dados reais)

Os cards de "Devocionais em Destaque", "Livros Publicados" e "Mensagens em Áudio e Vídeo" são **texto fixo no HTML** — não vêm da planilha. A planilha já tem abas prontas para isso (`Conteudo_Devocionais`, `Conteudo_Livros`, `Conteudo_Midias`, `Configuracoes_Site` com o versículo do dia e o aviso do topo), mas o site nunca faz uma leitura (`GET`) nelas. Ou seja: a aluna já modelou o banco pensando num painel de gestão de conteúdo futuro, mas essa parte ainda não foi construída no frontend. Isso não é um bug — é um próximo passo natural do projeto (ver `CORRECOES_E_LICOES.md`).

---

## Banco de dados (planilha)

| Aba | Colunas |
|---|---|
| `Leads_Devocionais` | ID, Data_Hora, Nome, Email, Nome_Devocional_Baixado, Status_Envio |
| `Newsletter` | ID, Data_Hora, Email, Status_Inscricao |
| `Conteudo_Devocionais` | ID, Status_Publicacao, Data_Publicacao, Categoria, Tempo_Leitura_Min, Titulo, Resumo, Conteudo_Completo_HTML, Link_PDF |
| `Conteudo_Livros` | ID, Status, Selo_Destaque, Titulo, Subtitulo, Descricao, Preco, Link_Pagamento, Link_Amostra |
| `Conteudo_Midias` | ID, Status, Tipo_Midia, Categoria_Selo, Titulo, Duracao, Descricao, Link_Arquivo_Url |
| `Configuracoes_Site` | Chave, Valor, Descricao_Uso |
| `Página1` | aba padrão criada pelo Google Sheets, sem uso |

Nenhuma aba/cabeçalho foi criado ou renomeado nesta revisão — a estrutura já existia e já batia com o que a API espera.

---

## Segurança e LGPD

- A API é **pública e sem login** (padrão `ANYONE_ANONYMOUS`, comum nos projetos da turma) — qualquer pessoa que descobrir a URL pode enviar dados. Isso é aceitável só para fins de aula. Antes de divulgar este site para o público real e coletar e-mails de pessoas de verdade, é recomendável adicionar alguma proteção (ex.: reCAPTCHA no formulário) e uma política de privacidade visível.
- Os dados coletados hoje (nome e e-mail de quem preenche) são dados pessoais reais assim que o site for divulgado — vale a aluna revisar com atenção antes de compartilhar o link amplamente.

---

## Roteiro de evolução sugerido (não implementado)

- Ligar as seções de Devocionais/Livros/Mídias à planilha (leitura via `GET` das abas `Conteudo_*`), em vez de texto fixo.
- Ler `versiculo_diario_texto`/`versiculo_diario_ref`/`aviso_topo_texto` da aba `Configuracoes_Site` em vez de texto fixo no HTML.
- Versionar o código do backend (Apps Script) dentro deste repositório, para poder revisar/corrigir por aqui no futuro.
