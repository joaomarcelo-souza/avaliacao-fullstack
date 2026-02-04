# avaliacao-fullstack

CRUD completo para gerenciamento de usuários, abrangendo backend (NestJS + TypeORM + PostgreSQL) e frontend (Angular).

---

## 🚀 Visão geral

Projeto de avaliação com operações CRUD de usuários. O backend expõe uma API REST em `/users` e o frontend consome essa API para listar, criar, editar e remover usuários.

---

## ✅ Pré-requisitos

- Node.js (>= 18) e npm

---

## 🖥️ Variáveis de ambiente

### Backend (exemplo: `backend/.env`)

Copie `backend/.env.example` para `backend/.env` e ajuste conforme necessário:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=senha_do_postgres
DB_NAME=avaliacao_fullstack
```

### Frontend

O arquivo `frontend/src/environments/environments.ts` contém a configuração `apiUrl` (por padrão `http://localhost:3000`). Você pode editar esse arquivo para apontar para a API.

Para conveniência há também `frontend/.env.example` que indica a configuração esperada.

---

## 🛠️ Como rodar localmente

### Backend

```bash
cd backend
npm install
# copie .env.example -> .env e ajuste
npm run start:dev
# a API ficará disponível em http://localhost:3000
# Docs do Swagger em http://localhost:3000/api
```

### Frontend

```bash
cd frontend
npm install
npm start
# ou durante desenvolvimento
ng serve
# frontend por padrão espera a API em http://localhost:3000 (ver `environment.apiUrl`)
```

---

## 🔍 Rotas principais

- `/users` — listagem de usuários
- `/register` — formulário de cadastro
- `/update-user/:id` — edição de usuário

---
