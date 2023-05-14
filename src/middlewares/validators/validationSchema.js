import Joi from 'joi';

const validateDateOfBirth = (value, helpers) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(value)) {
    return helpers.error('date.format');
  }
  return value;
};

const validateFields = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => {
        if (detail.type === 'date.format') {
          return `campo '${detail.context.key}': '${detail.context.value}' deve estar no formato DD/MM/YYYY`
        }
        if (detail.type === 'object.unknown') {
          return `campo '${detail.context.key}' inválido`;
        }
        if (detail.type === 'any.required') {
          return `campo '${detail.context.key}' é obrigatório`;
        }
        const fieldSchema = schema.describe().keys[detail.context.key];
        const fieldType = fieldSchema ? fieldSchema.type : 'desconhecido';
        return `Campo '${detail.context.key}': '${detail.context.value}' é inválido. Deve ser do tipo '${fieldType}'`;
      }).join(' e ');

      return res.status(400).json({ error: errorMessage });
    }
    req.body = value;
    next();
  };
};

const schema = Joi.object({
  customer_name: Joi.string().required(),
  car_brand: Joi.string().required(),
  car_model: Joi.string().required(),
  car_year: Joi.number().integer().required(),
  car_license_plate: Joi.string().required(),
  process_status: Joi.string().required(),
  cleaning_type: Joi.string().required(),
});

const validateFieldsMiddleware = validateFields(schema);

const schemaUserCreate = Joi.object({
  company: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  date_of_birth: Joi.string().custom(validateDateOfBirth, 'custom date format').required(),
  phone_number: Joi.string().required(),
});

const validateUserCreateFieldsMiddleware = validateFields(schemaUserCreate);

const schemaEmployeesUserCreate = Joi.object({
  full_name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  date_of_birth: Joi.string().custom(validateDateOfBirth, 'custom date format').required(),
  phone_number: Joi.string().required(),
  role: Joi.string().required(),
  permissions: Joi.string().required(),

});

const validateEmployeesUserCreateFieldsMiddleware = validateFields(schemaEmployeesUserCreate);

export { validateFieldsMiddleware, validateUserCreateFieldsMiddleware, validateEmployeesUserCreateFieldsMiddleware };
