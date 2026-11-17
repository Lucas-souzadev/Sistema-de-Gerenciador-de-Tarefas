// REPOSITORY: só lê e grava dados. Nenhuma regra de negócio aqui.
import { lerDados, salvarDados } from '../database.js';

export function listarTodos() {
  return lerDados().users;
}

export function buscarPorId(id) {
  return lerDados().users.find((usuario) => usuario.id === id);
}

export function buscarPorEmail(email) {
  return lerDados().users.find((usuario) => usuario.email === email);
}

export function salvar(usuario) {
  const dados = lerDados();
  dados.users.push(usuario);
  salvarDados(dados);
  return usuario;
}

export function excluir(id) {
  const dados = lerDados();
  dados.users = dados.users.filter((usuario) => usuario.id !== id);
  salvarDados(dados);
}
