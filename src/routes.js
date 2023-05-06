import carRegistrationRoutes from './routes/carRegistrationRoutes.js'

export default (app) => {

    app.get('/', (req, res) => {
        res.send('API Available at ' + new Date());
    });

    app.use('/cars', carRegistrationRoutes);
};
