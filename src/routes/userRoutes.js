import { Router } from 'express';
import { createUserLogin } from '../services/users/userRegistration.js';
import { loginUser, refreshTokens } from '../services/users/auth.js'
import { logoutUser } from '../services/users/logout.js'
import { validateUserCreateFieldsMiddleware } from '../middlewares/validators/validationSchema.js';

const router = Router();

router.post('/create-user', validateUserCreateFieldsMiddleware, createUserLogin);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/refresh-token', refreshTokens);

export default router;
