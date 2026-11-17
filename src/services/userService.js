// SERVICE de usuários (só o ADMIN usa).
import { AppError } from '../errors/AppError.js';
import { usuarioPublico } from '../models/User.js';
import * as userRepository from '../repositories/userRepository.js';
import * as projectRepository from '../repositories/projectRepository.js';

export function listar() {
  return userRepository.listarTodos().map(usuarioPublico);
}

export function excluir(id) {
  const usuario = userRepository.buscarPorId(id);
  if (!usuario) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  // Não deixa excluir usuário que ainda tem projetos (evita projetos "sem dono").
  if (projectRepository.listarDoUsuario(id).length > 0) {
    throw new AppError('Não é possível excluir: o usuário ainda possui projetos.', 409);
  }
  userRepository.excluir(id);
}
