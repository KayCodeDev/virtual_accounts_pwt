const { body } = require('express-validator');
const Provider = require('../../models/provider.model');
const Channel = require('../../models/channel.model');
const logger = require('../../utils/logger.utils');
const { isValidEmail, isValidDate } = require('../../utils/common.utils');


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
    body('email')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Email is required');
            }
            if (!await isValidEmail(value)) {
                throw new Error('Invalid email');
            }
        }),
    body('dob')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Date of birth is required');
            }
            if (!await isValidDate(value, "MM/DD/YYYY")) {
                throw new Error('Invalid Date of Birth. DOB must match format MM/DD/YYYY');
            }
        }),
    body('address')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Address is required');
            }
        }),
    body('gender')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider)) {
                if (value == undefined || value == null || value == "") {
                    throw new Error('Gender is required');
                }
                if (!["male", "female"].includes(value)) {
                    throw new Error('Invalid gender');
                }
            }
        }),
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
        .withMessage('Account name is required')
        .custom((value, { req }) => {
            const split = value.split(' ');
            if (split.length < 2) {
                throw new Error('Invalid account name. Account must be firstname and lastname');
            }
        }),
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
    body('email')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Email is required');
            }
            if (!await isValidEmail(value)) {
                throw new Error('Invalid email');
            }
        }),
    body('dob')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Date of birth is required');
            }
            if (!await isValidDate(value, "MM/DD/YYYY") == false) {
                throw new Error('Invalid Date of Birth. DOB must match format MM/DD/YYYY');
            }
        }),
    body('address')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider) && (value == undefined || value == null || value == "")) {
                throw new Error('Address is required');
            }
        }),
    body('gender')
        .custom(async (value, { req }) => {
            if (["gtbank_agency"].includes(req.body.provider)) {
                if (value == undefined || value == null || value == "") {
                    throw new Error('Gender is required');
                }
                if (!["male", "female"].includes(value)) {
                    throw new Error('Invalid gender');
                }
            }
        }),
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
        .isLength({ min: 11, max: 11 })
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

