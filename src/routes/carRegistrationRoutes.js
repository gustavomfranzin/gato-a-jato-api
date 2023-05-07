import { Router } from 'express';
import { createEntryCustomer, readCustomerCreated, updateCustomerCreated, deleteCustomerCreated } from '../services/carRegistration.js';
import validateFields from '../validators/validationSchema.js';
const router = Router();

router.post('/new-entry', validateFields, createEntryCustomer);

router.get('/list-entries', readCustomerCreated)

router.put('/update-entry/:id', validateFields, updateCustomerCreated);

router.delete('/delete-entry/:id', deleteCustomerCreated)

export default router;
