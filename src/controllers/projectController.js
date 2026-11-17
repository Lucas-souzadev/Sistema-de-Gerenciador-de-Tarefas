import * as projectService from '../services/projectService.js';

// req.body = dados enviados | req.params.id = id da URL | req.usuario = usuário logado

export function criar(req, res, next) {
  try {
    res.status(201).json(projectService.criar(req.body, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function listar(req, res, next) {
  try {
    res.status(200).json(projectService.listar(req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function buscarPorId(req, res, next) {
  try {
    res.status(200).json(projectService.buscarPorId(req.params.id, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function atualizar(req, res, next) {
  try {
    res.status(200).json(projectService.atualizar(req.params.id, req.body, req.usuario));
  } catch (erro) {
    next(erro);
  }
}

export function excluir(req, res, next) {
  try {
    projectService.excluir(req.params.id, req.usuario);
    res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

export function listarTarefas(req, res, next) {
  try {
    res.status(200).json(projectService.listarTarefas(req.params.id, req.usuario));
  } catch (erro) {
    next(erro);
  }
}
