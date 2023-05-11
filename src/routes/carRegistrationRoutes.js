import { Router } from 'express';
import { createEntryCustomer, readCustomerCreated, updateCustomerCreated, deleteCustomerCreated } from '../services/carRegistration.js';
import { validateFields } from '../validators/validationSchema.js';
import { verifyToken } from '../validators/validationToken.js'

const router = Router();

router.post('/new-entry', verifyToken, validateFields, createEntryCustomer);

router.get('/list-entries', verifyToken, readCustomerCreated)

router.put('/update-entry/:id', verifyToken, validateFields, updateCustomerCreated);

router.delete('/delete-entry/:id', verifyToken, deleteCustomerCreated)

export default router;
