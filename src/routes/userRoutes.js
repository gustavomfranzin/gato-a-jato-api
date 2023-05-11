import { Router } from 'express';
import { createUserLogin } from '../services/users/userRegistration.js';

const router = Router();

router.post('/create-user', createUserLogin);

export default router;
