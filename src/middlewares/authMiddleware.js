// MIDDLEWARE de AUTENTICAÇÃO ("quem é você?")
// Lê o cabeçalho  Authorization: Bearer <token>  e confere o JWT.
// Se estiver certo, guarda os dados do usuário em req.usuario e deixa a requisição continuar.
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return next(new AppError('Token não informado. Envie "Authorization: Bearer <token>".', 401));
  }

  const token = cabecalho.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, perfil }
  } catch (erro) {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
  next();
}
