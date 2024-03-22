const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const virtualAccountController = require('../controllers/virtualAccount.controller');
const { addVARequest, registerVARequest } = require('../middleware/validators/virtualAccountValidator.middleware');
const { squadcoNotificationRequest, globusNotificationRequest, agencyNotificationRequest } = require('../middleware/validators/notificationValidator.middleware');
const notificationController = require('../controllers/notification.controller');


router.get('/pos/account/:tid', auth('POS'), awaitHandlerFactory(virtualAccountController.getPosAccount));
router.get('/pos/transactions/:tid', auth('POS'), awaitHandlerFactory(virtualAccountController.getPosAccountTransactions));

router.get('/account/:account', auth(), awaitHandlerFactory(virtualAccountController.getAccount));
router.get('/transactions/:account', auth(), awaitHandlerFactory(virtualAccountController.getAccountTransactions));

router.post('/account/add', auth(), addVARequest, awaitHandlerFactory(virtualAccountController.addVirtualAccount));

router.post('/notifcation/gtbank', squadcoNotificationRequest, awaitHandlerFactory(notificationController.fromSquadco));
router.post('/notifcation/globus', globusNotificationRequest, awaitHandlerFactory(notificationController.fromGlobus));
router.post('/notifcation/agency', auth('AGENCY'), agencyNotificationRequest, awaitHandlerFactory(notificationController.fromAgency));

router.post('/account/register/:provider', auth(), registerVARequest, awaitHandlerFactory(virtualAccountController.registerVirtualAccount));


module.exports = router;