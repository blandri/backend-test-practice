import Joi from 'joi';

const registerValidation = (req, res, next) => {
    const userSchema = Joi.object({
        name: Joi.string().empty().required(),
        password: Joi.string()
            .required()
            .empty()
            .pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
            .messages({
                'any.required': '{{#label}} field is required',
                'string.base': '{{#label}} must be of type string',
                'string.empty': '{{#label}} can not be empty',
                'string.pattern.base': '{{#label}} must contain atleast a number, upper-case letter and longer than 8 characters'
            }),
        email: Joi.string().required().email(),
    });

    const result = userSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default registerValidation;
