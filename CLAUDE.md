# Guia para Assistente de Programacao

Este projeto chama-se `template-web-app-node-express-googleapi` e e uma aplicacao Node.js com Express que usa Google Sheets e Google Drive como storage via Google APIs.

## Stack Tecnologica

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Runtime | Node.js | 24 |
| Framework | Express | 5 |
| Google API | googleapis | 181+ |
| Container | Docker (Alpine) | — |
| CI/CD | GitHub Actions | — |

## Estrutura do Projeto

```
template-web-app-node-express-googleapi/
├── src/
│   ├── app.js                    # Express app com middlewares e rotas
│   ├── server.js                 # Entry point (escuta na porta PORT)
│   ├── config/
│   │   └── googleClient.js       # Autenticacao Google Sheets + Drive API
│   ├── controllers/
│   │   ├── userController.js     # Handler HTTP para usuarios
│   │   └── historyController.js  # Handler HTTP para historico
│   ├── routes/
│   │   ├── userRoutes.js         # Rotas /api/users (CRUD)
│   │   ├── historyRoutes.js      # Rotas /api/history
│   │   └── viewRoutes.js         # Rotas de frontend
│   ├── services/
│   │   ├── userService.js        # Logica de negocio (CRUD usuarios)
│   │   └── historyService.js     # Logica de negocio (historico por data)
│   └── utils/
│       ├── SheetsDB.js           # Abstrecao de acesso ao Google Sheets
│       ├── DriveDB.js            # Leitura de arquivos JSON no Google Drive
│       └── DriveSheetsDB.js      # Hibrido: busca ID no Sheets, le JSON no Drive
├── public/                       # Arquivos estaticos (CSS, HTML, JS)
│   ├── css/globals.css
│   ├── home/
│   ├── history/
│   └── users/
│       ├── search/
│       ├── create/
│       └── edit/
├── .github/workflows/
│   └── deploy.yaml               # Pipeline CI/CD (build + infra + deploy)
├── package.json
├── Dockerfile
└── values.yml
```

## Arquitetura

- Express.js serve todas as rotas (REST API + arquivos estaticos)
- Google Sheets e usado como banco de dados (via Service Account)
- Google Drive e usado para leitura de arquivos JSON historicos
- `DriveSheetsDB`: busca o `file_id` em uma planilha-indice e le o JSON correspondente no Drive
- Health check: `GET /api/health` retorna `{ status: 'ok' }`

### Secrets de Producao

As seguintes variaveis sao injetadas pelo HotPoint/Secrets Manager:

- `GOOGLE_CLIENT_EMAIL` — e-mail da service account do Google Cloud
- `GOOGLE_PRIVATE_KEY` — chave privada da service account
- `SPREADSHEET_ID` — ID da planilha Google Sheets usada como banco de usuarios
- `HISTORY_SPREADSHEET_ID` — ID da planilha de indice do historico (mapeia data → file_id no Drive)

As seguintes variaveis sao configuracao (nao secret):

- `HISTORY_SHEET_NAME` — nome da aba de indice no Sheets (padrao: `JSON Index`)

## Desenvolvimento Local

```bash
cp .env.example .env
# Preencha GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID e HISTORY_SPREADSHEET_ID no .env
npm install
npm start
```

## Deploy

- `npm ci` instala dependencias de producao
- Docker copia `src/` e `public/`
- Container roda `node src/server.js` na porta 3001

## Regras

1. API route `GET /api/health` NUNCA remover — deve retornar `{ status: 'ok' }` (200) sempre
2. `HOSTNAME=0.0.0.0` para o servidor escutar em todas as interfaces no container
3. NAO adicionar banco de dados relacional — Google Sheets/Drive e o storage desta aplicacao
4. NAO usar `prisma migrate` ou Liquibase — nao ha banco relacional
5. Secrets (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SPREADSHEET_ID`, `HISTORY_SPREADSHEET_ID`) NUNCA hardcodar
6. Health check deve ser instantaneo — NAO checar Google Sheets no health

## Rotas

| Metodo | Caminho | Descricao |
|--------|---------|-----------|
| GET | /api/health | Health check |
| GET | /api/users | Lista usuarios (aceita filtros via query string) |
| GET | /api/users/:id | Busca usuario por ID |
| POST | /api/users | Cria usuario |
| PATCH | /api/users/:id | Atualiza usuario |
| DELETE | /api/users/:id | Remove usuario |
| GET | /api/history | Retorna JSON historico por data (?date=YYYY-MM-DD) |
| GET | / | Pagina inicial |
| GET | /users | Lista usuarios (frontend) |
| GET | /users/create | Formulario de criacao |
| GET | /users/edit/:id | Formulario de edicao |
| GET | /history | Visualizador de historico (frontend) |

## SheetsDB — Operadores de Query

A classe `SheetsDB` suporta operadores MongoDB-like para filtrar linhas:

- `$ne` — diferente de
- `$gt`, `$gte` — maior que, maior ou igual
- `$lt`, `$lte` — menor que, menor ou igual
- `$in`, `$nin` — contido em, nao contido em
- `$contains` — string contem substring
