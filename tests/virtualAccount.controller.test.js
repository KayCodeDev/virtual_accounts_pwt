const VirtualAccountController = require('../controllers/virtualAccount.controller');
const VirtualAccount = require('../models/virtualAccount.model');

describe('VirtualAccountController', () => {
    describe('createVirtualAccount', () => {
        it('should create a new virtual account', async () => {
            const virtualAccountData = { accountNumber: '1234567890', accountName: 'Virtual Account 1' };
            const response = await VirtualAccountController.createVirtualAccount(virtualAccountData);
            expect(response).toEqual({ status: 201, data: virtualAccountData });
        });
    });

    describe('getVirtualAccounts', () => {
        it('should return a list of virtual accounts', async () => {
            const virtualAccounts = await VirtualAccount.findAll();
            const response = await VirtualAccountController.getVirtualAccounts();
            expect(response).toEqual({ status: 200, data: virtualAccounts });
        });
    });
});