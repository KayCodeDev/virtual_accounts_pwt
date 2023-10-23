const { body } = require('express-validator');
const Provider = require('../../models/provider.model');
const Channel = require('../../models/channel.model');


exports.addChannelRequest = [
    body('name')
        .exists()
        .withMessage('Name is required')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { name: value } });
            if (channel) {
                throw new Error('Channel name already exist');
            }
        }),
    body('email')
        .exists()
        .withMessage('Email is required')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { email: value } });
            if (channel) {
                throw new Error('Email already exist');
            }
        })
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('channelType')
        .exists()
        .withMessage('Channel type is required')
        .isIn(['merchant', 'tp'])
        .withMessage('Valid channel type is required'),
    body('webhookUrl')
        .optional()
        .isURL()
        .withMessage('Valid webhook is required'),
    body('bearer')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Bearer exceeds allowed length'),
    body('feeCharge')
        .exists()
        .withMessage('Fee charge is required')
        .isNumeric()
        .withMessage('Fee charge must be numeric'),
    body('feeCap')
        .exists()
        .withMessage('Fee Cap is required')
        .isNumeric()
        .withMessage('Fee cap must be numeric'),
    body('prefix')
        .exists()
        .withMessage('Prefix is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Prefix must be 3 digit')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { prefix: value } });
            if (channel) {
                throw new Error('Prefix already exist');
            }
        }),
];
exports.updateChannelRequest = [
    body('channelUUID')
        .exists()
        .withMessage('Channel ID is required')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { uuid: value } });
            if (!channel) {
                throw new Error('Invalid channel UUID');
            }
        }),
    body('feeCharge')
        .optional()
        .isNumeric()
        .withMessage('Fee charge must be numeric'),
    body('feeCap')
        .optional()
        .isNumeric()
        .withMessage('Fee cap must be numeric'),
    body('webhookUrl')
        .optional()
        .isURL()
        .withMessage('Valid webhook is required'),
    body('bearer')
        .optional(),
];


exports.addSettlementAccountRequest = [
    body('provider')
        .exists()
        .withMessage('Provider is required')
        .custom(async value => {
            const provider = await Provider.findOne({ where: { code: value } });
            if (!provider) {
                throw new Error('Invalid provider');
            }
        }),
    body('channelUUID')
        .exists()
        .withMessage('Channel ID is required')
        .custom(async value => {
            const channel = await Channel.findOne({ where: { uuid: value } });
            if (!channel) {
                throw new Error('Invalid channell UUID');
            }
        }),
    body('settlementAccount')
        .exists()
        .withMessage('Settlement account is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Settlement account must be 10 digit'),
    body('settlementAccountName')
        .exists()
        .withMessage('Settlement account name is required')

];

