import Joi from 'joi';

const schema = Joi.object({
    customer_name: Joi.string().required(),
    car_brand: Joi.string().required(),
    car_model: Joi.string().required(),
    car_year: Joi.number().integer().required(),
    car_license_plate: Joi.string().required(),
    process_status: Joi.string().required(),
    cleaning_type: Joi.string().required()
});

const validateFields = (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = `The following fields are required or not valid: ${error.details
            .map((detail) => `'${detail.context.key}'`)
            .join(', ')}`;
        return res.status(400).json({ error: errorMessage });
    }
    next();
};

const schemaUserCreate = Joi.object({
    company: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    full_name: Joi.string().required(),
    date_of_birth: Joi.date().iso().required(),
    phone_number: Joi.string().required(),
    permissions: Joi.string().required()
});

const validateUserCreateFields = (req, res, next) => {
    const { error } = schemaUserCreate.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = `The following fields are required or not valid: ${error.details
            .map((detail) => `'${detail.context.key}'`)
            .join(', ')}`;
        return res.status(400).json({ error: errorMessage });
    }
    next();
};



export { validateFields, validateUserCreateFields };
