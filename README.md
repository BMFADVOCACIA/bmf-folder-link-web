# BMF Folder Link Web

Pagina HTML estatica para abrir no Explorador do Windows uma pasta previamente identificada no indice OneDrive da BMF.

Status: **codigo preparado para revisao; GitHub Pages nao ativado**.

## Funcionamento

O ChatGPT consulta o MCP da BMF e confirma um resultado de pasta com caminho relativo. O endereco HTTPS inclui esse caminho no fragmento da URL, por exemplo:

    https://bmfadvocacia.github.io/bmf-folder-link-web/#/onedrive/Ambiente%20de%20Trabalho

A pagina valida o fragmento e apresenta um link para o protocolo local bmf-pasta://onedrive/... ao clicar. Exige BMF Folder Link v1.1 instalado no Windows. O Chrome pode solicitar confirmacao.

A pagina nao consulta API, nao autentica usuarios, nao acessa documentos e nao publica arquivos. Nomes de pastas no endereco sao visiveis no navegador e para quem receber o link. Nao confundir links com permissoes.

## Testes

    node --test tests/*.test.js

## Publicacao (nao autorizada)

Somente depois de autorizacao explicita: Settings > Pages > Deploy from a branch > main > root. Fazer teste live com a pasta de exemplo. Antes disso, manter os arquivos em branch de preparacao.

## Abertura automatica experimental

Ao abrir um link HTTPS de pasta, o navegador tenta acionar `bmf-pasta://` automaticamente. Se o Chrome bloquear a tentativa sem gesto direto do usuario, o botao manual permanece disponivel. A abertura automatica deve ser validada no Chrome real antes de ser considerada garantida.
