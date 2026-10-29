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
