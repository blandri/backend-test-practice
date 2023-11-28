import Joi from 'joi';

const resetRequestValidation = (req, res, next) => {
    const requestSchema = Joi.object({
        email: Joi.string().required().email(),
    });

    const result = requestSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default resetRequestValidation;
