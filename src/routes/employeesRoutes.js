import { Router } from 'express';
import { validateEmployeesUserCreateFieldsMiddleware } from '../middlewares/validators/validationSchema.js';
import { createEmployeesUser } from '../services/userEmployees/employeesRegistration.js';

const router = Router();

router.post('/create-user', validateEmployeesUserCreateFieldsMiddleware, createEmployeesUser);

export default router;
