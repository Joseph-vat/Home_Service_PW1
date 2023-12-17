# HomeService: Um aplicativo de divulgação de anúncios de atividades domésticas 
## Projeto para disciplina de Programação para Web 2023.2

Grupo:
- [Danrlei](https://github.com/dxnrlei)
- [Joyce](https://github.com/Joyce-Firmino)
- [Zé Neto](https://github.com/Joseph-vat)

## Descrição do projeto

Neste projeto nós desenvolvemos uma plataforma de divulgação de serviços domésticos que conecta usuários a provedores de serviços locais, oferecendo uma solução abrangente e conveniente para atender às necessidades do mercado de serviços domésticos.

## Passo a passo
1. Primeiramente confira se você já tem o node, o prisma e o docker instalados no seu computador, caso não possua baixe através destes links:
<a href="https://nodejs.org/pt-br/download">node</a>, <a href="https://www.prisma.io/docs/getting-started/setup-prisma">prisma</a>,
<a href="https://docs.docker.com/desktop/install/windows-install/">docker</a>.

2. Faça o clone desse repositório.

3. Na pasta do repositório, utilize o comando `npm install` para instalar as dependências do projeto.

4. Crie um arquivo `.env` na raiz do seu projeto e configure as variáveis de ambiente necessárias.
 Exemplo:
```
CHAVE_SECRETA= "suaChaveSecreta"
DATABASE_URL = "yourDatabaseUrl"
```
5. Faça as migrations com o comando 'npx prisma migrate dev' para gerar um arquivo na pasta prisma/migrations, nesse arquivo, você vai encontrar um script SQL que representa as alterações que você fez no arquivo prisma/schema.prisma.

6. Agora, inicie o servidor com o comando `npm start`.

7. Pronto, agora você pode testar a aplicação.

## Documentação

Usuário Prestador de Serviços
URL	| Método | Descrição
------|------------|-----
/prestador |	POST |	Recurso de criação de usuário prestador de serviços, espera um json no corpo da requisição
/prestador	| GET |	Recurso de exibição de dados dos usuários prestadores de serviços.
/prestadorservico	| GET |	Recurso de exibição de dados de prestadores de serviços por serviço prestado, espera um json no corpo da requisição
/prestador	| PUT	| Recurso de atualização do perfil usuário prestador de serviços, espera um json no corpo da requisição com os dados a serem atualizados e o e-mail do usuário no cabeçalho da requisição para autenticação.
/prestador/dadosSeguranca	| PUT	| Recurso de atualização de dados sensíveis do usuário prestador de serviços, espera um json no corpo da requisição com os dados a serem atualizados e o e-mail do usuário no cabeçalho da requisição para autenticação.
/prestadorFoto	| PUT	| Recurso de atualização da foto de perfil do usuário prestador de serviços, espera um multpart/form no corpo da requisição e o e-mail do usuário no cabeçalho da requisição para autenticação.
/prestador	| DELETE |	Recurso de exclusão de usuários prestadores de serviços, espera o e-mail do usuário no cabeçalho da requisição para autenticação.

Usuário Cliente
URL	| Método | Descrição
------|------------|-----
/cliente |	POST |	Recurso de criação de usuário cliente, espera um json no corpo da requisição
/cliente	| GET |	Recurso de exibição de dados dos usuários cliente.
/cliente	| PUT	| Recurso de atualização do perfil usuário cliente, espera um json no corpo da requisição e o e-mail do usuário no cabeçalho da requisição para autenticação.
/cliente/dadosSeguranca	| PUT	| Recurso de atualização de dados sensíveis do usuário cliente, espera um json no corpo da requisição e o e-mail do usuário no cabeçalho da requisição para autenticação.
/clienteFoto	| PUT	| Recurso de atualização da foto de perfil do usuário cliente, espera um multpart/form no corpo da requisição e o e-mail do usuário no cabeçalho da requisição para autenticação.
/cliente	| DELETE |	Recurso de exclusão de usuários prestadores de serviços, espera o e-mail do usuário no cabeçalho da requisição para autenticação.

Autenticação
URL	| Método | Descrição
------|------------|-----
/login |	POST |	Recurso de fazer login e autenticar usuário, espera um json no corpo da requisição

Anúncio
URL	| Método | Descrição
------|------------|-----
/anuncio |	POST |	Recurso de criação de anuncio, espera um json no corpo da requisição e o e-mail do usuário no cabeçalho da requisição para autenticação.
/anuncios	| GET |	Recurso de exibição de dados de todos os anuncios cadastrados.
/anunciosPrestador	| GET |	Recurso de exibição de anuncios de um prestador, espera o e-mail do usuário no cabeçalho da requisição para autenticação.
/anuncios/:id |	PUT	| Recurso de atualização das informações do anúncio, espera um json no corpo da requisição, recebe como parâmetro o id do anúncio a ser atualizado e o e-mail do usuário no cabeçalho da requisição para autenticação.
/anuncio/:id	| DELETE |	Recurso de exclusão de anúncio, recebe como parâmetro o id do anúncio a ser deletado e o e-mail do usuário no cabeçalho da requisição para autenticação.
