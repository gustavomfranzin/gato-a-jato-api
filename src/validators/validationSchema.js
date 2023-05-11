import Joi from 'joi';

const schema = Joi.object({
    customer_name: Joi.string().required().messages({
        'any.required': `The field 'customer_name' is required`,
    }),
    car_brand: Joi.string().required().messages({
        'any.required': `The field 'car_brand' is required`,
    }),
    car_model: Joi.string().required().messages({
        'any.required': `The field 'car_model' is required`,
    }),
    car_year: Joi.number().required().messages({
        'any.required': `The field 'car_year' is required`,
    }),
    car_license_plate: Joi.string().required().messages({
        'any.required': `The field 'car_license_plate' is required`,
    }),
    process_status: Joi.string().required().messages({
        'any.required': `The field 'process_status' is required`,
    }),
    cleaning_type: Joi.string().required().messages({
        'any.required': `The field 'cleaning_type' is required`,
    }),
});

const validateFields = (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = `The following fields are required: ${error.details
            .map((detail) => `'${detail.context.key}'`)
            .join(', ')}`;
        return res.status(400).json({ error: errorMessage });
    }
    next();
};

const schemaUserCreate = Joi.object({
    username: Joi.string().required().messages({ 'any.required': `The Field 'username' is required'` }),
    email: Joi.string().required().messages({ 'any.required': `The Field 'email' is required'` }),
    password: Joi.string().required().messages({ 'any.required': `The Field 'password' is required'` }),
    full_name: Joi.string().required().messages({ 'any.required': `The Field 'full_name' is required'` }),
    date_of_birth: Joi.string().required().messages({ 'any.required': `The Field 'date_of_birth' is required'` }),
    phone_number: Joi.string().required().messages({ 'any.required': `The Field 'phone_number' is required'` })
});

const validateUserCreateFields = (req, res, next) => {
    const { error } = schemaUserCreate.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = `The following fields are required: ${error.details
            .map((detail) => `'${detail.context.key}'`)
            .join(', ')}`;
        return res.status(400).json({ error: errorMessage });
    }
    next();
};



export { validateFields, validateUserCreateFields };
