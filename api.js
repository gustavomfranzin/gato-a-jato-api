import { PORT } from './config.js';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('API Available at ' + new Date());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
