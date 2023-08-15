const { body } = require('express-validator');
const Provider = require('../../models/provider.model');


exports.addProviderRequest = [
    body('name')
        .exists()
        .withMessage('Provider name is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { name: value } });
            if (provider) {
                throw new Error('Provider name already exist');
            }
        }),
    body('code')
        .exists()
        .withMessage('Provider code is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { code: value } });
            if (provider) {
                throw new Error('Provider code already exist');
            }
        }),
    body('prefix')
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage('Prefix must be 3 digit'),
    body('credentials')
        .exists()
        .withMessage('Provider credentials are required')
    // .isJSON()
    // .withMessage('credentials must be a json')
];
