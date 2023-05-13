import { PORT } from './config.js';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { validateJsonSyntax } from './middlewares/validators/validationsRoutes.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(validateJsonSyntax)

app.use('/api', createProxyMiddleware({ target: 'https://www.carqueryapi.com', changeOrigin: true }));

routes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} !`);
});
