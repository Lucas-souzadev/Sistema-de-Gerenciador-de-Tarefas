# API de Tarefas

Atividade prática do 2º bimestre — **API e Web Services** (Sistemas para Internet, UNIMAM).
API REST com **Node.js + Express** para gerenciar projetos e tarefas, com login por **JWT**, perfis de acesso (ADMIN e USER), arquitetura em camadas e dados salvos em arquivo **JSON**.

**Integrantes:** _(preencher com os nomes do trio)_

## Como executar

```bash
npm install
cp .env.example .env     # no Windows: copy .env.example .env
npm start
```

A API sobe em `http://localhost:3000`. Ao iniciar, é criado o usuário **ADMIN** definido no `.env` (`ADMIN_EMAIL` e `ADMIN_SENHA`).
Exemplos de requisições prontos no arquivo `requests.http` (extensão *REST Client* do VS Code) — ou use Postman/Insomnia.

## Entidades e relacionamentos

| Entidade | Campos |
|---|---|
| **Usuário** (`User`) | id, nome, email, senhaHash, perfil (`ADMIN` ou `USER`) |
| **Projeto** (`Project`) | id, nome, descricao, **usuarioId** |
| **Tarefa** (`Task`) | id, titulo, descricao, status, prioridade, prazo, **projetoId**, **usuarioId** |

```
Usuário 1 ───── N Projeto 1 ───── N Tarefa
```

Um usuário tem vários projetos e um projeto tem várias tarefas. A integridade é garantida nos Services: tarefa só é criada em projeto existente (e do próprio usuário), projeto com tarefas não concluídas não é excluído, e usuário com projetos não é excluído.

## Arquitetura em camadas

```
src/
├── routes/         endpoints e middlewares de cada rota
├── controllers/    recebe a requisição e devolve a resposta HTTP
├── services/       regras de negócio e validações
├── repositories/   leitura e gravação dos dados
├── models/         estrutura das entidades
├── middlewares/    autenticação (JWT), autorização (ADMIN) e erros
├── errors/         erro simples com código HTTP
├── database.js     lê/grava o arquivo JSON
├── app.js          configuração do Express
└── server.js       liga o servidor
```

Para manter o projeto mais fácil de estudar, as validações simples ficam diretamente nos Services, sem pastas extras de utilitários ou permissões.\n\nCaminho de uma requisição: **Rota → Middleware (token/perfil) → Controller → Service → Repository → arquivo JSON**.

## Autenticação e autorização

- `POST /auth/register` cria usuário sempre com perfil **USER** (qualquer `perfil` enviado é ignorado).
- O **ADMIN** só é criado pelo servidor, com os dados do `.env`.
- `POST /auth/login` confere e-mail e senha (hash com bcrypt) e devolve um **token JWT**.
- Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.
- Rotas `/users` são só para ADMIN (USER recebe **403**).
- USER vê e altera apenas os próprios projetos e tarefas (de outro usuário → **403**). ADMIN vê todos.

## Endpoints

| Método | Rota | Quem acessa | O que faz |
|---|---|---|---|
| POST | `/auth/register` | público | Cadastra usuário |
| POST | `/auth/login` | público | Login (retorna o token) |
| GET | `/users` | ADMIN | Lista usuários |
| DELETE | `/users/:id` | ADMIN | Exclui usuário (sem projetos) |
| POST | `/projects` | logado | Cria projeto |
| GET | `/projects` | logado | Lista **os meus** projetos (ADMIN: todos) |
| GET | `/projects/:id` | dono ou ADMIN | Busca projeto |
| PUT | `/projects/:id` | dono ou ADMIN | Atualiza projeto |
| DELETE | `/projects/:id` | dono ou ADMIN | Exclui projeto |
| GET | `/projects/:id/tasks` | dono ou ADMIN | Projeto com suas tarefas |
| POST | `/tasks` | logado | Cria tarefa em um projeto |
| GET | `/tasks` | logado | Lista **as minhas** tarefas (ADMIN: todas) |
| GET | `/tasks/:id` | dono ou ADMIN | Busca tarefa |
| PUT | `/tasks/:id` | dono ou ADMIN | Atualiza tarefa |
| PATCH | `/tasks/:id/status` | dono ou ADMIN | Muda o status |
| DELETE | `/tasks/:id` | dono ou ADMIN | Exclui tarefa |

Valores válidos — **status:** `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA` · **prioridade:** `BAIXA`, `MEDIA`, `ALTA` · **prazo:** `AAAA-MM-DD`.

## Regras de negócio (nos Services)

1. **Prazo no passado não é aceito** ao criar ou editar tarefa (`taskService.js`) → 400.
2. **Tarefa concluída não muda mais** de status nem pode ser editada (`taskService.js`) → 409.
3. **Projeto com tarefas não concluídas não pode ser excluído** (`projectService.js`) → 409.

Também: e-mail único no cadastro e usuário com projetos não pode ser excluído.

## Códigos HTTP

| Código | Quando |
|---|---|
| 200 | Operação realizada |
| 201 | Recurso criado |
| 204 | Exclusão realizada |
| 400 | Dados inválidos ou faltando |
| 401 | Sem token, token inválido/expirado ou login errado |
| 403 | Sem permissão (perfil ou recurso de outro usuário) |
| 404 | Recurso ou rota não encontrada |
| 409 | Conflito (e-mail repetido ou regra de negócio) |
| 500 | Erro interno |

Erros sempre respondem no formato `{ "erro": "mensagem" }`.

## Persistência

Os dados ficam em `data/db.json` e continuam lá depois de reiniciar o servidor.
