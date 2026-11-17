import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar); // todas as rotas abaixo exigem token

router.post('/', projectController.criar);
router.get('/', projectController.listar);
router.get('/:id', projectController.buscarPorId);
router.put('/:id', projectController.atualizar);
router.delete('/:id', projectController.excluir);
router.get('/:id/tasks', projectController.listarTarefas);

export default router;
