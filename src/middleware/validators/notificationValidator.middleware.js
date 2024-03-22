const { body } = require('express-validator');
const Provider = require('../../models/provider.model');


exports.squadcoNotificationRequest = [
    body('transaction_reference')
        .exists()
        .withMessage('Transaction reference is required'),
    body('virtual_account_number')
        .exists()
        .withMessage('Virtual account is required'),
    body('principal_amount')
        .exists()
        .withMessage('Principal amount is required'),
    body('settled_amount')
        .exists()
        .withMessage('Settled amount is required'),
    body('fee_charged')
        .exists()
        .withMessage('Fee charge is required'),
    body('transaction_date')
        .exists()
        .withMessage('Transaction date is required'),
    body('customer_identifier')
        .exists()
        .withMessage('Customer identifier is required'),
    body('transaction_indicator')
        .exists()
        .withMessage('Transaction indicator is required'),
    body('remarks')
        .exists()
        .withMessage('Remark is required'),
    body('currency')
        .exists()
        .withMessage('Currency is required'),
    body('channel')
        .exists()
        .withMessage('Channel is required'),
    body('sender_name')
        .exists()
        .withMessage('Sender name is required'),
    body('encrypted_body')
        .exists()
        .withMessage('Encrypted body is required'),
];

exports.globusNotificationRequest = [
    body('Id')
        .exists()
        .withMessage('ID is required'),
    body('Amount')
        .exists()
        .withMessage('Amount is required'),
    body('narration')
        .exists()
        .withMessage('Narration is required'),
    body('transactionType')
        .exists()
        .withMessage('Transaction type is required'),
    body('AvailableBalance')
        .exists()
        .withMessage('Available balance is required'),
    body('TransactionDate')
        .exists()
        .withMessage('Transaction date is required'),
    body('NubanAccount')
        .exists()
        .withMessage('Nuban account is required'),
    body('TransID')
        .exists()
        .withMessage('Transaction ID is required'),
    body('NubanAccountName')
        .exists()
        .withMessage('Nuban account name is required'),
    body('VirtualAccount')
        .exists()
        .withMessage('Virtual account is required')
];


exports.agencyNotificationRequest = [
    body('walletID')
        .exists()
        .withMessage('Wallet ID is required'),
    body('amount')
        .exists()
        .withMessage('Amount is required'),
    body('accountNumber')
        .exists()
        .withMessage('Account number is required'),
    body('transactionID')
        .exists()
        .withMessage('Transaction id is required'),
    body('senderAccountNumber')
        .exists()
        .withMessage('Sender account number is required'),
    body('senderAccountName')
        .exists()
        .withMessage('Sender account name is required'),
    body('senderBank')
        .exists()
        .withMessage('Sender bank is required'),
    body('narration')
        .optional(),
    body('transactionDate')
        .exists()
        .isDate()
        .withMessage('Transaction date is required'),
];
