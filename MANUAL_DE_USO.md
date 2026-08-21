# Manual de Uso — Mulher de Fé

Este manual é para quem **não é programador**. Explica o que o site faz e onde ver os resultados.

## O que é este site

Uma página de divulgação de conteúdo devocional cristão, no ar em:

**https://kerllenmaia-code.github.io/Mulher-de-f-/**

## O que os visitantes podem fazer

1. **Baixar o devocional gratuito** — clicam no botão "Baixar Devocional Gratuito" (no topo ou no início da página), preenchem Nome e E-mail, e enviam.
2. **Assinar a newsletter** — no final da página, digitam só o e-mail e clicam em "Inscrever".

## Onde os dados aparecem

Tudo o que é preenchido nos formulários vai direto para a planilha do Google:

**"Banco de Dados Mulheres de Fé"**
https://docs.google.com/spreadsheets/d/1WvTjCKAtO1QSZ3ciFYepvnxlOmkKL9A608jwvdZQjug/edit

- Quem baixou o devocional aparece na aba **Leads_Devocionais** (nome, e-mail, data e hora).
- Quem assinou a newsletter aparece na aba **Newsletter** (e-mail, data e hora).

Não é preciso fazer nada para os dados chegarem lá — é automático assim que a pessoa clica em enviar no site.

## Como saber se está tudo funcionando

Abra o site, preencha um cadastro de teste (pode usar um nome como "TESTE" para não confundir com um contato de verdade) e depois abra a planilha na aba correspondente — a linha nova deve aparecer em poucos segundos. Depois, é só apagar essa linha de teste na planilha (clique com o botão direito no número da linha → Excluir linha).

## O que ainda não está pronto

As seções "Devocionais em Destaque", "Livros Publicados" e "Mensagens em Áudio e Vídeo" mostram sempre o mesmo conteúdo fixo — mesmo que a planilha tenha abas próprias para cadastrar esse conteúdo (`Conteudo_Devocionais`, `Conteudo_Livros`, `Conteudo_Midias`), o site ainda não lê essas abas. Ou seja: hoje, para trocar os textos dessas seções, é preciso editar o arquivo `index.html` diretamente (ou pedir ajuda para isso) — preencher essas abas da planilha, por enquanto, não muda nada no site.

## Se algo parar de funcionar

O sintoma mais comum é: a pessoa preenche o formulário, a tela mostra uma mensagem de erro de conexão. Nesse caso, avise o professor/responsável técnico — pode ser que o link do backend (Apps Script) tenha mudado ou que alguma permissão do Google tenha sido revogada.

## Atenção — dados reais de pessoas (LGPD)

Este site coleta nome e e-mail de quem visita. Como o link que recebe esses dados é público (não exige login), é importante:

- Só divulgar amplamente quando já existir uma política de privacidade simples explicando o que é feito com o e-mail;
- Evitar deixar o link circulando "à toa" sem necessidade, para reduzir spam nos formulários.
