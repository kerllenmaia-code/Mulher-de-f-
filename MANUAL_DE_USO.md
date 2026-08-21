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

## Painel Administrativo — gerenciando o conteúdo do site

Agora existe uma tela própria para a Kerllen cadastrar e editar o conteúdo do site sem precisar mexer na planilha:

**https://kerllenmaia-code.github.io/Mulher-de-f-/admin.html**

### Primeiro acesso

1. Abra o endereço acima.
2. Digite a **senha provisória** (o Luciano vai te passar essa senha por fora, não fica escrita em nenhum lugar público).
3. O painel vai pedir para você **criar sua própria senha** (mínimo 6 caracteres, digitada duas vezes para confirmar). Depois disso a senha provisória para de funcionar — só a nova senha que você escolheu abre o painel dali em diante.
4. Guarde essa senha nova em lugar seguro (ela fica salva no Google, não em nenhum arquivo do site — se esquecer, peça para o Luciano resetar).

### O que dá para fazer no painel

- **Devocionais**, **Livros** e **Mídias**: clique em "Novo" para cadastrar, ou "Editar"/"Remover" num item já existente. Cada um tem um campo para colar o **link** (PDF do devocional, link de compra do livro, link do vídeo/áudio) e um campo para colar a **URL de uma imagem** (capa, banner do card). Todo item tem um status: "Rascunho" (não aparece no site) ou "Publicado" (aparece).
- **Leads (Devocional)** e **Newsletter**: são só para consulta — mostra quem se cadastrou pelo site, não dá para editar por aqui.
- **Configurações do Site**: o texto e a referência do "Versículo do Dia", o aviso da barra verde do topo, e a imagem de banner que aparece atrás do título principal do site.

Assim que você salva algo como "Publicado" no painel, ele aparece no site público em poucos segundos (só recarregar a página).

### Dica sobre imagens

O painel não recebe upload de arquivo — você precisa colar o **endereço (URL)** de uma imagem que já esteja hospedada em algum lugar (por exemplo, uma imagem do Google Drive com link público, ou de qualquer site de imagens). Se não tiver uma imagem, pode deixar o campo em branco — o site mostra um ícone no lugar.

## Se algo parar de funcionar

O sintoma mais comum é: a pessoa preenche o formulário, a tela mostra uma mensagem de erro de conexão. Nesse caso, avise o professor/responsável técnico — pode ser que o link do backend (Apps Script) tenha mudado ou que alguma permissão do Google tenha sido revogada.

## Atenção — dados reais de pessoas (LGPD)

Este site coleta nome e e-mail de quem visita. Como o link que recebe esses dados é público (não exige login), é importante:

- Só divulgar amplamente quando já existir uma política de privacidade simples explicando o que é feito com o e-mail;
- Evitar deixar o link circulando "à toa" sem necessidade, para reduzir spam nos formulários.

A tela de leads/newsletter dentro do painel administrativo também mostra nome e e-mail de pessoas reais — por isso o painel pede senha. Não compartilhe a senha do painel com quem não precisa ver essa lista.
