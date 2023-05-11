import { Router } from 'express';
import { createUserLogin, getUsers } from '../services/users/userRegistration.js';

const router = Router();

router.post('/create-user', createUserLogin);
//rota para testes de desenvolvimento, será removida
router.get('/users-list', getUsers);

export default router;
