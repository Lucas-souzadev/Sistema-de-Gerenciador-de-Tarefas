import * as taskService from '../services/taskService.js';

export function criar(req, res, next) {
  try {
    res.status(201).json(taskService.criar(req.body, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function listar(req, res, next) {
  try {
    res.status(200).json(taskService.listar(req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function buscarPorId(req, res, next) {
  try {
    res.status(200).json(taskService.buscarPorId(req.params.id, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function atualizar(req, res, next) {
  try {
    res.status(200).json(taskService.atualizar(req.params.id, req.body, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function alterarStatus(req, res, next) {
  try {
    res.status(200).json(taskService.alterarStatus(req.params.id, req.body, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function excluir(req, res, next) {
  try {
    taskService.excluir(req.params.id, req.usuario);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}
