# Sistema de Almoxarifado

Backend em Node.js, Express e MySQL para controle de usuarios, produtos e movimentacoes de estoque.

## Arquitetura MVC

```txt
src/
  config/        Conexao com MySQL
  controllers/   Recebem requisicoes e retornam respostas HTTP
  errors/        Erros padronizados da aplicacao
  middlewares/   Autenticacao, autorizacao e tratamento de erros
  models/        Consultas SQL e acesso ao banco
  routes/        Rotas da API
  services/      Regras de negocio
  utils/         Funcoes auxiliares
  validators/    Validacao dos dados de entrada
```

## Recursos

- Autenticacao JWT.
- Perfis `OPERADOR` e `ADMINISTRADOR`.
- Rotas privadas por perfil.
- Produtos com paginacao e filtros.
- Entradas e saidas com data/hora e usuario responsavel.
- Atualizacao automatica do saldo.
- Bloqueio de saida com estoque insuficiente.

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o banco MySQL executando:

```bash
mysql -u root -p < sql/schema.sql
```

3. Configure o `.env`:

```env
APP_PORT=3000
JWT_SECRET=segredo-local-saep-fun-2
JWT_EXPIRES_IN=8h

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=almoxarifado_saep
```

4. Inicie a API:

```bash
npm run dev
```

5. Teste no navegador:

```txt
http://localhost:3000/api
http://localhost:3000/api/health
```

## Usuario inicial

O script `sql/schema.sql` cria um administrador:

- E-mail: `admin@almoxarifado.local`
- Senha: `Admin@123`

## Insomnia

Importe o arquivo:

```txt
INSOMNIA_IMPORTAR.json
```

Depois faca login em `Autenticacao > Login administrador`, copie o token e coloque no `Base Environment` em `jwt_token`.

## Postman

Importe o arquivo:

```txt
POSTMAN_IMPORTAR.json
```

No Postman, execute `Autenticacao > Login administrador`. A colecao salva o token automaticamente na variavel `jwt_token`.

## Principais rotas

- `GET /api`
- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/usuarios`
- `POST /api/usuarios`
- `GET /api/produtos?page=1&limit=10&nome=alcool&dataInicio=2026-01-01&dataFim=2026-12-31`
- `POST /api/produtos`
- `PUT /api/produtos/:id`
- `DELETE /api/produtos/:id`
- `POST /api/movimentacoes/entrada`
- `POST /api/movimentacoes/saida`
- `GET /api/movimentacoes`

Operadores podem consultar, inserir e atualizar. Administradores podem consultar, inserir, atualizar e deletar.
# estrutura_prova_saep2
# estrutura_prova_saep2
