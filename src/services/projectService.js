// SERVICE de projetos: regras e validações dos projetos.
const textoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';

function verificarAcesso(projeto, usuario) {
  if (projeto.usuarioId !== usuario.id && usuario.perfil !== 'ADMIN') {
    throw new AppError('Você não tem permissão para acessar este projeto.', 403);
  }
}
import { AppError } from '../errors/AppError.js';
import { novoProjeto } from '../models/Project.js';
import * as projectRepository from '../repositories/projectRepository.js';
import * as taskRepository from '../repositories/taskRepository.js';

export function criar(dados, usuario) {
  if (!textoValido(dados.nome)) {
    throw new AppError('O nome do projeto é obrigatório.', 400);
  }
  const descricao = textoValido(dados.descricao) ? dados.descricao.trim() : '';
  const projeto = novoProjeto(dados.nome.trim(), descricao, usuario.id);
  return projectRepository.salvar(projeto);
}

// USER vê só os seus projetos. ADMIN vê todos.
export function listar(usuario) {
  if (usuario.perfil === 'ADMIN') {
    return projectRepository.listarTodos();
  }
  return projectRepository.listarDoUsuario(usuario.id);
}

export function buscarPorId(id, usuario) {
  const projeto = projectRepository.buscarPorId(id);
  if (!projeto) {
    throw new AppError('Projeto não encontrado.', 404);
  }
  verificarAcesso(projeto, usuario);
  return projeto;
}

export function atualizar(id, dados, usuario) {
  const projeto = buscarPorId(id, usuario);
  if (!textoValido(dados.nome)) {
    throw new AppError('O nome do projeto é obrigatório.', 400);
  }
  projeto.nome = dados.nome.trim();
  projeto.descricao = textoValido(dados.descricao) ? dados.descricao.trim() : '';
  return projectRepository.atualizar(projeto);
}

// REGRA DE NEGÓCIO 3: não pode excluir projeto que ainda tem tarefas não concluídas.
export function excluir(id, usuario) {
  const projeto = buscarPorId(id, usuario);

  const tarefas = taskRepository.listarDoProjeto(projeto.id);
  const naoConcluidas = tarefas.filter((tarefa) => tarefa.status !== 'CONCLUIDA');
  if (naoConcluidas.length > 0) {
    throw new AppError('Não é possível excluir: o projeto tem tarefas não concluídas.', 409);
  }

  taskRepository.excluirDoProjeto(projeto.id); // apaga as tarefas já concluídas junto
  projectRepository.excluir(projeto.id);
}

// Consulta com relacionamento: o projeto e todas as suas tarefas.
export function listarTarefas(id, usuario) {
  const projeto = buscarPorId(id, usuario);
  const tarefas = taskRepository.listarDoProjeto(projeto.id);
  return { projeto, total: tarefas.length, tarefas };
}
