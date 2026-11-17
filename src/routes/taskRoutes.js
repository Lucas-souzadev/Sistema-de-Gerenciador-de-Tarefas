import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar); // todas as rotas abaixo exigem token

router.post('/', taskController.criar);
router.get('/', taskController.listar);
router.get('/:id', taskController.buscarPorId);
router.put('/:id', taskController.atualizar);
router.patch('/:id/status', taskController.alterarStatus);
router.delete('/:id', taskController.excluir);

export default router;
