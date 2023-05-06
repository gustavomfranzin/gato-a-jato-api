import { createEntryCustomer, readCustomerCreated, updateCustomerCreated, deleteCustomerCreated } from './services/carRegistration.js';
import { PORT } from './config.js';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/new-entry', createEntryCustomer);

app.get('/list-entries', readCustomerCreated)

app.put('/update-entry/:id', updateCustomerCreated);

app.delete('/delete-entry/:id', deleteCustomerCreated)

app.get('/', (req, res) => {
    res.send('API Available at ' + new Date());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} !`);
});
