import { body, param, validationResult } from 'express-validator';

// common validators
export const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};

// specific rules
export const bookAppointmentRules = [
    body('doctorId').isMongoId().withMessage('doctorId must be a valid ID'),
    body('date').isISO8601().withMessage('date must be an ISO8601 string'),
    body('time')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('time must be in HH:mm format')
];

export const updateStatusRules = [
    param('id').isMongoId().withMessage('Appointment ID is invalid'),
    body('status').isIn(['pending', 'approved', 'cancelled']).withMessage('Invalid status')
];

export const registerRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/)
        .withMessage('Password must include uppercase, lowercase, and a number')
];

export const loginRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

export const doctorCreateRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/)
        .withMessage('Password must include uppercase, lowercase, and a number'),
    body('specialization').notEmpty().withMessage('Specialization is required'),
    body('experience').isNumeric().withMessage('Experience must be a number'),
    body('consultationFee').isNumeric().withMessage('Consultation fee must be a number')
    // availability validation could be added if needed
];

export const doctorUpdateRules = [
    param('id').isMongoId().withMessage('Doctor ID is invalid'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('experience').optional().isNumeric().withMessage('Experience must be a number'),
    body('consultationFee').optional().isNumeric().withMessage('Consultation fee must be a number')
];

// reusable param validator
export const idParamRules = [
    param('id').isMongoId().withMessage('ID must be a valid Mongo ID')
];

// other rule sets can go here
