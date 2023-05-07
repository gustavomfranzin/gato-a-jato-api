import { PORT } from './config.js';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { validateJsonSyntax } from './validators/validationsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(validateJsonSyntax)

routes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} !`);
});
