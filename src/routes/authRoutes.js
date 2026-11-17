import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/register', authController.cadastrar);
router.post('/login', authController.login);

export default router;
