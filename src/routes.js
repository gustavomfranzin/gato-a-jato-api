import carRegistrationRoutes from './routes/carRegistrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { verifyToken } from './validators/validationToken.js'

export default (app) => {

    app.get('/', (req, res) => {
        res.send('API Available at ' + new Date());
    });

    app.use('/cars', verifyToken, carRegistrationRoutes);
    app.use('/auth', userRoutes);
};
