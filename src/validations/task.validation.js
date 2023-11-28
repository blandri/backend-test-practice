import Joi from 'joi';

const taskValidation = (req, res, next) => {
    const taskSchema = Joi.object({
        title: Joi.string().empty().required(),
        assignees:  Joi.string().empty().required(),
        select_projects: Joi.string().empty().required(),
        priority: Joi.string().required().valid('NORMAL', 'HIGH').empty(),
        description: Joi.string().empty().required().max(100, 'Project description must be lower than 100 characters'),
        start_date: Joi.date().iso().required().empty().min(Date.now()).messages({
            'date.base': 'Start date must be a valid date',
            'date.empty': 'Start date cannot be empty',
            'any.required': 'Start date is required',
            'date.format':
              'Start date is not correct, ISO standard must be year-month-day',
            'date.min': 'check in date must not be in the past'
        }),
        end_date: Joi.date().iso().required().empty().min(Date.now()).messages({
            'date.base': 'End date must be a valid date',
            'date.empty': 'End date cannot be empty',
            'any.required': 'End date is required',
            'date.format':
              'End date is not correct, ISO standard must be year-month-day',
            'date.min': 'check in date must not be in the past'
        }),
        file_attachment: Joi.string().empty(''),
    });

    const result = taskSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default taskValidation;
