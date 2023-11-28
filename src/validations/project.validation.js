import Joi from 'joi';

const projectValidation = (req, res, next) => {
    const projectSchema = Joi.object({
        title: Joi.string().empty().required(),
        description: Joi.string().empty().required()
    });

    const result = projectSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default projectValidation;
