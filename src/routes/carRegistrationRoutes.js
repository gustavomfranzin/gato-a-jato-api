import { Router } from 'express';
import { createEntryCustomer, readCustomerCreated, updateCustomerCreated, deleteCustomerCreated } from '../services/carRegistration.js';
import { validateFieldsMiddleware } from '../middlewares/validators/validationSchema.js';


const router = Router();

router.post('/new-entry', validateFieldsMiddleware, createEntryCustomer);

router.get('/list-entries', readCustomerCreated)

router.put('/update-entry/:id', validateFieldsMiddleware, updateCustomerCreated);

router.delete('/delete-entry/:id', deleteCustomerCreated)

export default router;
