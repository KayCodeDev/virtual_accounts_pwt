const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const providerController = require('../controllers/provider.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { addChannelRequest, updateChannelRequest, addSettlementAccountRequest } = require('../middleware/validators/channelValidator.middleware');
const { addProviderRequest } = require('../middleware/validators/providerValidator.middleware');
const virtualAccountController = require('../controllers/virtualAccount.controller');
const { addPosVARequest, addVAManualRequest } = require('../middleware/validators/virtualAccountValidator.middleware');


router.get('/channels', auth('ADMIN'), awaitHandlerFactory(channelController.getAllChannels));
router.post('/channels/add', auth('ADMIN'), addChannelRequest, awaitHandlerFactory(channelController.addChannel));
router.post('/channels/update', auth('ADMIN'), updateChannelRequest, awaitHandlerFactory(channelController.updateChannel));
router.post('/channels/account/add', auth('ADMIN'), addSettlementAccountRequest, awaitHandlerFactory(channelController.addChannelAccount)); // localhost:3000/api/v1/users/whoami

router.get('/providers', auth('ADMIN'), awaitHandlerFactory(providerController.getAllProvider));
router.post('/providers/add', auth('ADMIN'), addProviderRequest, awaitHandlerFactory(providerController.addProvider));
router.post('/providers/update/:uuid', auth('ADMIN'), awaitHandlerFactory(providerController.updateProvider));

router.get('/accounts/transactions/notifications', auth('ADMIN'), awaitHandlerFactory(virtualAccountController.getAllProviderTransNotification));

router.get('/accounts', auth('ADMIN'), awaitHandlerFactory(virtualAccountController.getAllAccount));
router.get('/accounts/transactions', auth('ADMIN'), awaitHandlerFactory(virtualAccountController.getAllAccountTrans));
router.post('/accounts/add', auth('ADMIN'), addPosVARequest, awaitHandlerFactory(virtualAccountController.addPosVirtualAccount));
router.post('/accounts/add/manual', auth('ADMIN'), addVAManualRequest, awaitHandlerFactory(virtualAccountController.addVirtualAccountManually));

module.exports = router;