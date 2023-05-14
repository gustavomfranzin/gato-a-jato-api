import carRegistrationRoutes from './routes/carRegistrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import employeesRoutes from './routes/employeesRoutes.js'

export default (app) => {

    app.get('/', (req, res) => {
        res.send('API Available at ' + new Date());
    });

    app.use('/cars', authMiddleware, carRegistrationRoutes);
    app.use('/employees', authMiddleware, employeesRoutes)
    app.use('/auth', userRoutes);
};
