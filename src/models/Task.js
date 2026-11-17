// MODEL: Tarefa
// Campos: id, titulo, descricao, status, prioridade, prazo, projetoId, usuarioId
// Relacionamentos:
//   projetoId -> id do projeto da tarefa (Projeto 1 -> N Tarefas)
//   usuarioId -> id do dono da tarefa (o mesmo dono do projeto)
import { randomUUID } from 'node:crypto';

export const STATUS_VALIDOS = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'];
export const PRIORIDADES_VALIDAS = ['BAIXA', 'MEDIA', 'ALTA'];

export function novaTarefa(titulo, descricao, prioridade, prazo, projetoId, usuarioId) {
  return {
    id: randomUUID(),
    titulo,
    descricao,
    status: 'PENDENTE', // toda tarefa começa pendente
    prioridade,
    prazo, // texto AAAA-MM-DD ou null
    projetoId,
    usuarioId,
  };
}
