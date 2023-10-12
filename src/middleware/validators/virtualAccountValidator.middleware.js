const { body } = require('express-validator');
const Provider = require('../../models/provider.model');
const Channel = require('../../models/channel.model')


exports.addPosVARequest = [
    body('provider')
        .exists()
        .withMessage('Provider is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { code: value } });
            if (!provider) {
                throw new Error('Invalid provider');
            }
        }),
    body('accountName')
        .exists()
        .withMessage('Account name is required'),
    body('bvn')
        .exists()
        .withMessage('BVN is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('BVN must be 11 character'),
    body('phoneNumber')
        .exists()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('tid')
        .exists()
        .withMessage('Terminal ID is required')
        .isLength({ min: 8, max: 8 })
        .withMessage('Invalid terminal ID'),
    body('settlementAccount')
        .optional()
        .isLength({ min: 10, max: 10 })
        .withMessage('Invalid settlement account'),
];

exports.addVARequest = [
    body('provider')
        .exists()
        .withMessage('Provider is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { code: value } });
            if (!provider) {
                throw new Error('Invalid provider');
            }
        }),
    body('accountName')
        .exists()
        .withMessage('Account name is required'),
    body('bvn')
        .exists()
        .withMessage('BVN is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('BVN must be 11 character'),
    body('phoneNumber')
        .exists()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number')
];


exports.addVAManualRequest = [
    body('provider')
        .exists()
        .withMessage('Provider is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { code: value } });
            if (!provider) {
                throw new Error('Invalid provider');
            }
        }),
    body('channel')
        .exists()
        .withMessage('Channel UUIID is required')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { uuid: value } });
            if (!channel) {
                throw new Error('Invalid channel');
            }
        }),
    body('accountName')
        .exists()
        .withMessage('Account name is required'),
    body('accountNumber')
        .exists()
        .withMessage('Account number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Account number must be 10 character'),
    body('bvn')
        .optional()
        .isLength({ min: 11, max: 11 })
        .withMessage('Valid BVN is required'),
    body('phoneNumber')
        .optional()
        .isLength({ min: 10, max: 10 })
        .withMessage('Valid Phone number is required'),
];

exports.registerVARequest = [
    body('accountName')
        .exists()
        .withMessage('Account name is required'),
    body('accountNumber')
        .exists()
        .withMessage('Account number is required'),
    body('tid')
        .exists()
        .withMessage('Terminal ID is required')
        .isLength({ min: 8, max: 8 })
        .withMessage('Invalid terminal ID'),
    body('settlementAccount')
        .exists()
        .withMessage('Merchant settlement account is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Invalid settlement account'),
    body('phoneNumber')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number'),
];

