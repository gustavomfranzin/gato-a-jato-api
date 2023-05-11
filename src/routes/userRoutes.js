import { Router } from 'express';
import { createUserLogin, loginUser } from '../services/users/userRegistration.js';
import { validateUserCreateFields } from '../validators/validationSchema.js';

const router = Router();

router.post('/create-user', validateUserCreateFields, createUserLogin);
router.post('/login', loginUser)
export default router;
