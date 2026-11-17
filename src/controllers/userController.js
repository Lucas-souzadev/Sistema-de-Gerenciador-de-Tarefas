import * as userService from '../services/userService.js';

export function listar(req, res, next) {
  try {
    res.status(200).json(userService.listar());
  } catch (erro) {
    next(erro);
  }
}

export function excluir(req, res, next) {
  try {
    userService.excluir(req.params.id);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}
