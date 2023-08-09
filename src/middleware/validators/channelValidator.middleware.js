const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');


exports.createChannelSchema = [
    body('name')
        .exists()
        .withMessage('Name is required'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('channelType')
        .exists()
        .withMessage('Channel type is required')
        .isIn(['merchant', 'tp'])
        .withMessage('Valid channel type is required'),
    body('webhook')
        .optional()
        .isURL()
        .withMessage('Valid webhook is required'),
    body('bearer')
        .optional(),
    body('prefix')
        .optional()
        .isLength({ min: 3, max: 3 })
];

