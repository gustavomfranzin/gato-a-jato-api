import carRegistrationRoutes from './routes/carRegistrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

export default (app) => {

    app.get('/', (req, res) => {
        res.send('API Available at ' + new Date());
    });

    app.use('/cars', authMiddleware, carRegistrationRoutes);
    app.use('/auth', userRoutes);
};
