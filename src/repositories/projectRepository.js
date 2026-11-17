import { lerDados, salvarDados } from '../database.js';

export function listarTodos() {
  return lerDados().projects;
}

export function listarDoUsuario(usuarioId) {
  return lerDados().projects.filter((projeto) => projeto.usuarioId === usuarioId);
}

export function buscarPorId(id) {
  return lerDados().projects.find((projeto) => projeto.id === id);
}

export function salvar(projeto) {
  const dados = lerDados();
  dados.projects.push(projeto);
  salvarDados(dados);
  return projeto;
}

// Troca o projeto antigo pelo projeto atualizado (mesmo id).
export function atualizar(projetoAtualizado) {
  const dados = lerDados();
  const posicao = dados.projects.findIndex((projeto) => projeto.id === projetoAtualizado.id);
  dados.projects[posicao] = projetoAtualizado;
  salvarDados(dados);
  return projetoAtualizado;
}

export function excluir(id) {
  const dados = lerDados();
  dados.projects = dados.projects.filter((projeto) => projeto.id !== id);
  salvarDados(dados);
}
