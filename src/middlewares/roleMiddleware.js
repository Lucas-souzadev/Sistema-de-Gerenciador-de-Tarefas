// MIDDLEWARE de AUTORIZAÇÃO ("você pode fazer isso?")
// Deixa passar só quem tem perfil ADMIN. Precisa vir depois do "autenticar".
import { AppError } from '../errors/AppError.js';

export function apenasAdmin(req, res, next) {
  if (req.usuario.perfil !== 'ADMIN') {
    return next(new AppError('Acesso proibido: somente administradores.', 403));
  }
  next();
}
