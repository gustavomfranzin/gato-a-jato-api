import { Router } from 'express';
import { createUserLogin } from '../services/users/userRegistration.js';
import { validateUserCreateFields } from '../validators/validationSchema.js';

const router = Router();

router.post('/create-user', validateUserCreateFields, createUserLogin);

export default router;
