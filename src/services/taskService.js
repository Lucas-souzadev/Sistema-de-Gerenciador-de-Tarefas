// SERVICE de tarefas: regras e validações das tarefas.
const textoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';

function verificarAcesso(tarefa, usuario) {
  if (tarefa.usuarioId !== usuario.id && usuario.perfil !== 'ADMIN') {
    throw new AppError('Você não tem permissão para acessar esta tarefa.', 403);
  }
}
import { AppError } from '../errors/AppError.js';
import { novaTarefa, STATUS_VALIDOS, PRIORIDADES_VALIDAS } from '../models/Task.js';
import * as projectRepository from '../repositories/projectRepository.js';
import * as taskRepository from '../repositories/taskRepository.js';

// REGRA DE NEGÓCIO 1: o prazo da tarefa não pode estar no passado.
function validarPrazo(prazo) {
  if (!prazo) {
    return; // prazo é opcional
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(prazo) || isNaN(new Date(prazo))) {
    throw new AppError('O prazo deve estar no formato AAAA-MM-DD.', 400);
  }
  const hoje = new Date().toLocaleDateString('en-CA'); // data de hoje no formato AAAA-MM-DD
  if (prazo < hoje) {
    throw new AppError('O prazo da tarefa não pode estar no passado.', 400);
  }
}

function validarPrioridade(prioridade) {
  if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
    throw new AppError('Prioridade inválida. Use: BAIXA, MEDIA ou ALTA.', 400);
  }
}

export function criar(dados, usuario) {
  if (!textoValido(dados.titulo)) {
    throw new AppError('O título da tarefa é obrigatório.', 400);
  }
  const prioridade = dados.prioridade || 'MEDIA';
  validarPrioridade(prioridade);
  validarPrazo(dados.prazo);

  if (!textoValido(dados.projetoId)) {
    throw new AppError('O projetoId é obrigatório.', 400);
  }
  const projeto = projectRepository.buscarPorId(dados.projetoId);
  if (!projeto) {
    throw new AppError('Projeto não encontrado.', 404);
  }
  verificarAcesso(projeto, usuario); // só cria tarefa em projeto próprio (ADMIN em qualquer um)

  const descricao = textoValido(dados.descricao) ? dados.descricao.trim() : '';
  const tarefa = novaTarefa(
    dados.titulo.trim(),
    descricao,
    prioridade,
    dados.prazo || null,
    projeto.id,
    projeto.usuarioId
  );
  return taskRepository.salvar(tarefa);
}

// USER vê só as suas tarefas. ADMIN vê todas.
export function listar(usuario) {
  if (usuario.perfil === 'ADMIN') {
    return taskRepository.listarTodas();
  }
  return taskRepository.listarDoUsuario(usuario.id);
}

export function buscarPorId(id, usuario) {
  const tarefa = taskRepository.buscarPorId(id);
  if (!tarefa) {
    throw new AppError('Tarefa não encontrada.', 404);
  }
  verificarAcesso(tarefa, usuario);
  return tarefa;
}

export function atualizar(id, dados, usuario) {
  const tarefa = buscarPorId(id, usuario);

  if (tarefa.status === 'CONCLUIDA') {
    throw new AppError('Uma tarefa concluída não pode ser editada.', 409);
  }
  if (!textoValido(dados.titulo)) {
    throw new AppError('O título da tarefa é obrigatório.', 400);
  }

  tarefa.titulo = dados.titulo.trim();
  if (dados.descricao !== undefined) {
    tarefa.descricao = textoValido(dados.descricao) ? dados.descricao.trim() : '';
  }
  if (dados.prioridade !== undefined) {
    validarPrioridade(dados.prioridade);
    tarefa.prioridade = dados.prioridade;
  }
  if (dados.prazo !== undefined && dados.prazo !== tarefa.prazo) {
    validarPrazo(dados.prazo);
    tarefa.prazo = dados.prazo || null;
  }
  return taskRepository.atualizar(tarefa);
}

export function alterarStatus(id, dados, usuario) {
  if (!STATUS_VALIDOS.includes(dados.status)) {
    throw new AppError('Status inválido. Use: PENDENTE, EM_ANDAMENTO ou CONCLUIDA.', 400);
  }
  const tarefa = buscarPorId(id, usuario);

  // REGRA DE NEGÓCIO 2: tarefa concluída não pode voltar atrás nem mudar de status.
  if (tarefa.status === 'CONCLUIDA') {
    throw new AppError('Uma tarefa concluída não pode mudar de status.', 409);
  }

  tarefa.status = dados.status;
  return taskRepository.atualizar(tarefa);
}

export function excluir(id, usuario) {
  const tarefa = buscarPorId(id, usuario);
  taskRepository.excluir(tarefa.id);
}
