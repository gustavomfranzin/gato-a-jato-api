import { Router } from 'express';
import { createEntryCustomer, readCustomerCreated, updateCustomerCreated, deleteCustomerCreated } from '../services/carRegistration.js';

const router = Router();

router.post('/new-entry', createEntryCustomer);

router.get('/list-entries', readCustomerCreated)

router.put('/update-entry/:id', updateCustomerCreated);

router.delete('/delete-entry/:id', deleteCustomerCreated)

export default router;
