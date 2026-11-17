import { lerDados, salvarDados } from '../database.js';

export function listarTodas() {
  return lerDados().tasks;
}

export function listarDoUsuario(usuarioId) {
  return lerDados().tasks.filter((tarefa) => tarefa.usuarioId === usuarioId);
}

// Todas as tarefas de um projeto (relacionamento Projeto 1 -> N Tarefas)
export function listarDoProjeto(projetoId) {
  return lerDados().tasks.filter((tarefa) => tarefa.projetoId === projetoId);
}

export function buscarPorId(id) {
  return lerDados().tasks.find((tarefa) => tarefa.id === id);
}

export function salvar(tarefa) {
  const dados = lerDados();
  dados.tasks.push(tarefa);
  salvarDados(dados);
  return tarefa;
}

export function atualizar(tarefaAtualizada) {
  const dados = lerDados();
  const posicao = dados.tasks.findIndex((tarefa) => tarefa.id === tarefaAtualizada.id);
  dados.tasks[posicao] = tarefaAtualizada;
  salvarDados(dados);
  return tarefaAtualizada;
}

export function excluir(id) {
  const dados = lerDados();
  dados.tasks = dados.tasks.filter((tarefa) => tarefa.id !== id);
  salvarDados(dados);
}

export function excluirDoProjeto(projetoId) {
  const dados = lerDados();
  dados.tasks = dados.tasks.filter((tarefa) => tarefa.projetoId !== projetoId);
  salvarDados(dados);
}
