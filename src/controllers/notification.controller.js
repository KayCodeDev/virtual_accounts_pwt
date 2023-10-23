
const { checkValidation, toSha512, formatDate, randGen } = require('../utils/common.utils');
const Provider = require('../models/provider.model');
const VirtualAccount = require('../models/virtualAccount.model');
const Channel = require('../models/channel.model');
const { getTime } = require('date-fns');
const TransactionNotification = require('../models/transactionNotification.model');
const notificationService = require('../services/notification.service');
const ProviderNotification = require('../models/providerNotifications.model');


class NotificationController {
    fromSquadco = async (req, res, next) => {
        checkValidation(req);
        console.log("Callback from Squad", req.body);
        const { transaction_reference: reference, virtual_account_number: account, principal_amount: amount, transaction_date: date, sender_name: originator, remarks: description } = req.body;

        let providerNotification = await ProviderNotification.create({
            ip: req.ip,
            notification: req.body,
            accountNumber: account
        });

        const accountProvider = await VirtualAccount.findOne({
            where: { accountNumber: account },
            include: [
                {
                    model: Provider,
                }
            ]
        });

        if (accountProvider == null) {
            providerNotification.update({ appstatus: "failed" })
            res.status(400).send({ error: "No account found" });
        } else {

            const provider = accountProvider.Provider;

            providerNotification.ProviderId = provider.id;
            await providerNotification.save();

            const hash = toSha512(JSON.stringify(req.body), provider.credentials.secretKey);

            if (hash != req.headers['x-squad-signature']) {
                console.log("Invalid signature")
                console.log(hash + " : " + req.headers['x-squad-signature'])
                providerNotification.update({ appstatus: "failed" })
                res.status(400).send({ error: "Invalid signature" });
            } else {
                return this.__handleNotification(res, provider, reference, account, parseFloat(amount), formatDate(date), originator, description, req.body, providerNotification);
            }
        }
    }

    fromGlobus = async (req, res, next) => {
        checkValidation(req);
        console.log("Callback from Globus", req.body);
        const provider = await Provider.findOne({ where: { code: "globus" } });

        let providerNotification = await ProviderNotification.create({
            ip: req.ip,
            notification: req.body,
            ProviderId: provider.id,
        });


        if ((req.headers['clientid'] ?? req.headers['ClientID']) == provider.credentials.cliendID) {
            const { TransID: reference, VirtualAccount: account, Amount: amount, TransactionDate: date, NubanAccountName: originator, narration: description } = req.body;
            originator = req.body.NubanAccount + "|" + originator;

            providerNotification.update({ accountNumber: account })

            return this.__handleNotification(res, provider, reference, account, parseFloat(amount), formatDate(date), originator, description, req.body, providerNotification);
        } else {
            res.status(400).send({ error: "Invalid Cliend ID" });
            providerNotification.update({ appstatus: "failed" })
        }
    }

    __handleNotification = async (res, provider, reference, acct, amount, date, originator, description, response, providerNotification) => {
        try {
            const account = await VirtualAccount.findOne({
                where: { accountNumber: acct, ProviderId: provider.id },
                include: [
                    {
                        model: Channel,
                    }
                ]
            });

            if (!account) {
                providerNotification.update({ appstatus: "failed" })
                res.status(400).send({ error: "Invalid virtual account" });
            } else {
                let transactionId = "CLP-PWT-" + randGen(10) + getTime(new Date());
                let feeCharge = ((amount * account.Channel.feeCharge) / 100);
                if (feeCharge > account.Channel.feeCap) {
                    feeCharge = account.Channel.feeCap;
                }
                let settledAmount = amount - feeCharge;

                await TransactionNotification.create({
                    accountNumber: account.accountNumber,
                    reference,
                    transactionId,
                    amount,
                    feeCharge,
                    settledAmount,
                    description,
                    transactionDate: date,
                    originator,
                    providerNotification: response,
                    VirtualAccountId: account.id,
                    ChannelId: account.Channel.id,
                });

                res.status(200).send({ message: "Notification acknowledged" });

                await provider.update({ received: (provider.received + amount) });

                await account.update({ received: (account.received + amount) });

                await account.Channel.update({ collected: (account.Channel.collected + amount), settled: (account.Channel.settled + settledAmount) });

                const notification = await TransactionNotification.findOne({
                    where: { reference },
                    attributes: { exclude: ['providerNotification', 'channelResponse', 'ip', 'deletedAt', 'ChannelId'] },
                    include: [
                        {
                            model: VirtualAccount,
                            attributes: ['tid', 'accountNumber', 'accountName'],
                            include: {
                                model: Provider,
                                attributes: ['name', 'code'],
                            },
                        },

                    ],
                });

                providerNotification.update({ appstatus: "processed" })

                if (account.tid != null && account.tid.length == 8) {
                    notificationService.sendSocket(account, notification, providerNotification);
                }
                if (account.Channel.webhookUrl != null) {
                    notificationService.sendWebhook(account, notification, providerNotification);
                }
            }
        } catch (e) {
            console.log(e.message)
            res.status(400).send({ error: "Duplicate transaction notification" });
        }
    }
}
module.exports = new NotificationController;