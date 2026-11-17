// MODEL: Usuário
// Campos: id, nome, email, senhaHash, perfil ("ADMIN" ou "USER")
import { randomUUID } from 'node:crypto';

export function novoUsuario(nome, email, senhaHash, perfil) {
  return { id: randomUUID(), nome, email, senhaHash, perfil };
}

// Dados do usuário que podem ser mostrados (sem a senha).
export function usuarioPublico(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil };
}
