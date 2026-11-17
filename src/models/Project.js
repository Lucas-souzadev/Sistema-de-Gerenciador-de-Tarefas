// MODEL: Projeto
// Campos: id, nome, descricao, usuarioId
// Relacionamento: usuarioId guarda o id do dono do projeto (Usuário 1 -> N Projetos)
import { randomUUID } from 'node:crypto';

export function novoProjeto(nome, descricao, usuarioId) {
  return { id: randomUUID(), nome, descricao, usuarioId };
}
