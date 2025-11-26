# Task Manager API

API desenvolvida como desafio da formação Full Stack, construída em **Node.js** com foco em um sistema de gerenciamento de tarefas.
A aplicação permite criar contas, autenticar usuários e gerenciar tarefas de forma organizada, com atribuição de responsáveis, controle de status e prioridades.

## 🚀 Tecnologias

* Node.js
* Express
* Prisma
* JWT para autenticação
* PostgreSQL
* Zod para validações
* Bcrypt para hash de senha

## 📌 Funcionalidades

### 👤 Usuários

* Cadastro de usuários
* Login com autenticação JWT
* Acesso a rotas protegidas

### 🗂 Tarefas

* Criar, listar, atualizar e excluir tarefas
* Atribuição de tarefas a membros da equipe
* Classificação por:

  * **Status**
  * **Prioridade**
* Acompanhamento claro do progresso

## 📦 Como rodar o projeto

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar migrações do Prisma
npx prisma migrate dev

# Iniciar o servidor
npm run dev
```

## 🔐 Autenticação

A aplicação utiliza **JWT**, então para acessar rotas protegidas é necessário enviar o token no header:

```
Authorization: Bearer seu_token
```

## 🗃 Banco de Dados

O projeto utiliza **PostgreSQL**, e o Prisma é responsável pelo gerenciamento de esquema e queries.

## 📁 Estrutura do projeto (exemplo)

```
src/
├─ controllers/
├─ middlewares/
├─ routes/
├─ database/
└─ utils/
```

## 🧑‍💻 Autor

Desenvolvido por **Yuri Viana**
