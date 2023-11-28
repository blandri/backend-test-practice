import Joi from 'joi';

const resetValidation = (req, res, next) => {
    const resetSchema = Joi.object({
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
    });

    const result = resetSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default resetValidation;
