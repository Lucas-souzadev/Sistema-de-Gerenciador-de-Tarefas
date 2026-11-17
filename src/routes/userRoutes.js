import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { apenasAdmin } from '../middlewares/roleMiddleware.js';

const router = Router();

// Todas as rotas de usuários exigem login E perfil ADMIN.
router.use(autenticar, apenasAdmin);

router.get('/', userController.listar);
router.delete('/:id', userController.excluir);

export default router;
