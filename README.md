# SFGC Website BackEnd

Bem-vindo(a) ao repositório do **SFGC Website API**! Este é o back-end que alimenta a aplicação front-end do SFGC. Aqui, você encontrará todas as informações necessárias para entender este projeto.

## Sobre o Projeto

O **SFGC Website API** foi desenvolvido para gerenciar as funcionalidades principais do site, como autenticação de usuários, gerenciamento de postagens e muito mais. Ele utiliza o framework **Fastify** para lidar com as requisições e o banco de dados **PostgreSQL**, hospedado na plataforma **Neon**.

### Principais Funcionalidades
- **Autenticação JWT**: Login seguro com geração de tokens.
- **Gerenciamento de Postagens**: Criação, edição, exclusão e listagem de posts.
- **CORS Configurado**: Permite comunicação segura entre o front-end e o back-end.

## Tecnologias Utilizadas

- **Node.js**
- **Fastify**
- **PostgreSQL** (via Neon)
- **dotenv** para gerenciamento de variáveis de ambiente
- **bcryptjs** para hashing de senhas

## Como Configurar o Projeto

### Pré-requisitos

Antes de começar, você precisará ter instalado na sua máquina:
- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- Um banco de dados **PostgreSQL** configurado

### Passo a Passo

1. Clone este repositório:
   ```bash
   git clone https://github.com/Valenart/SFGC-Website-Api.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd SFGC-Website-Api
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```env
     PORT=3333
     JWT_SECRET=sua_chave_secreta
     CORS_ORIGIN=http://localhost:3000
     CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS
     PGHOST=seu_host
     PGDATABASE=seu_banco
     PGUSER=seu_usuario
     PGPASSWORD=sua_senha
     ENDPOINT_ID=seu_endpoint_id
     ```

5. Execute o servidor:
   ```bash
   npm start
   ```

6. O servidor estará disponível em: `http://localhost:3333`

## Estrutura do Projeto

- `server.js`: Arquivo principal do servidor.
- `db.js`: Centraliza toda a lógica de interação com o banco de dados.
- `routes/`: Contém as rotas públicas e privadas.
  - `public/`: Rotas acessíveis sem autenticação.
  - `private/`: Rotas que exigem autenticação JWT.
- `tables.js`: Script para criação das tabelas no banco de dados.

## Contribuindo

Contribuições são bem-vindas. Se você encontrou algum problema ou tem sugestões de melhorias, fique à vontade para abrir uma **issue** ou enviar um **pull request**.

### Passos para Contribuir
1. Faça um fork deste repositório.
2. Crie uma nova branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e adicione os commits:
   ```bash
   git commit -m "Minha contribuição"
   ```
4. Envie para o seu repositório forkado:
   ```bash
   git push origin minha-feature
   ```
5. Abra um pull request neste repositório.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

Espero que este projeto seja útil para você! Se tiver dúvidas ou precisar de ajuda, é só chamar.
