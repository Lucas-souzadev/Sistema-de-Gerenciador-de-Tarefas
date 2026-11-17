// CONTROLLER: recebe a requisição, chama o Service e devolve a resposta HTTP.
// Não tem regra de negócio. Se der erro, entrega para o errorHandler com next(erro).
import * as authService from '../services/authService.js';

export function cadastrar(req, res, next) {
  try {
    const usuario = authService.cadastrar(req.body);
    res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

export function login(req, res, next) {
  try {
    const resultado = authService.login(req.body);
    res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}
