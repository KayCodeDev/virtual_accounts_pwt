const ProviderController = require('../controllers/provider.controller');
const Provider = require('../models/provider.model');

describe('ProviderController', () => {
    describe('createProvider', () => {
        it('should create a new provider', async () => {
            const providerData = { name: 'Provider 1', email: 'provider1@example.com' };
            const response = await ProviderController.createProvider(providerData);
            expect(response).toEqual({ status: 201, data: providerData });
        });
    });

    describe('getProviders', () => {
        it('should return a list of providers', async () => {
            const providers = await Provider.findAll();
            const response = await ProviderController.getProviders();
            expect(response).toEqual({ status: 200, data: providers });
        });
    });
});