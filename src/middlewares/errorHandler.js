// MIDDLEWARE DE ERROS: todo erro do sistema passa por aqui e vira uma resposta JSON.
// (O Express sabe que é um handler de erro porque a função tem 4 parâmetros.)
import { AppError } from '../errors/AppError.js';

export function errorHandler(erro, req, res, next) {
  // Erro que nós mesmos lançamos (validação, regra de negócio, permissão...)
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  // JSON escrito errado no corpo da requisição
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  // Qualquer outro erro é bug do sistema
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}
