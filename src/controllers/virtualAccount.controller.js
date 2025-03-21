
const dotenv = require('dotenv');
const { respondSuccess, respondError, checkValidation, switchProviderCall, randGen } = require('../utils/common.utils');
const Provider = require('../models/provider.model');
const { Op, literal } = require("sequelize");
const VirtualAccount = require('../models/virtualAccount.model');
const Channel = require('../models/channel.model');
const SettlementAccount = require('../models/settlementAccount.model');
const TransactionNotification = require('../models/transactionNotification.model');
const ProviderNotification = require('../models/providerNotifications.model');
const logger = require('../utils/logger.utils');

dotenv.config();


class VirtualAccountController {
    getAllAccount = async (req, res, next) => {

        const page = parseInt(req.query.page ?? 1);
        const limit = parseInt(req.query.perpage ?? 15);
        const search = req.query.search ?? null;

        const offset = (page - 1) * limit;

        let accounts = await VirtualAccount.findAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Channel, attributes: ['uuid', 'name', 'channelType']
                },
                {
                    model: Provider, attributes: ['name', 'code']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                    { accountName: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const totalItems = await VirtualAccount.count({
            include: [
                {
                    model: Channel, attributes: ['uuid', 'name', 'channelType']
                },
                {
                    model: Provider, attributes: ['name', 'code']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                    { accountName: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const count = accounts.length;

        const totalPages = Math.ceil(totalItems / limit);

        return respondSuccess(res, "Virtual account list retrieved", { accounts, currentPage: page, perPage: count, total: totalItems, pages: totalPages });
    };

    getAllAccountTrans = async (req, res, next) => {

        const page = parseInt(req.query.page ?? 1);
        const limit = parseInt(req.query.perpage ?? 15);
        const search = req.query.search ?? null;

        const offset = (page - 1) * limit;

        let transactions = await TransactionNotification.findAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Channel, attributes: ['uuid', 'name']
                },
                {
                    model: VirtualAccount, attributes: ['accountNumber', 'accountName', 'bvn', 'received']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                    { reference: { [Op.like]: `%${search}%` } },
                    { transactionId: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const totalItems = await TransactionNotification.count({
            include: [
                {
                    model: Channel, attributes: ['uuid', 'name']
                },
                {
                    model: VirtualAccount, attributes: ['accountNumber', 'accountName', 'bvn', 'received']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                    { reference: { [Op.like]: `%${search}%` } },
                    { transactionId: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const count = transactions.length;

        const totalPages = Math.ceil(totalItems / limit);

        return respondSuccess(res, "Transaction list retrieved", { transactions, currentPage: page, perPage: count, total: totalItems, pages: totalPages });
    };

    getAllProviderTransNotification = async (req, res, next) => {

        const page = parseInt(req.query.page ?? 1);
        const limit = parseInt(req.query.perpage ?? 15);
        const search = req.query.search ?? null;

        const offset = (page - 1) * limit;

        let notifications = await ProviderNotification.findAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Provider, attributes: ['code', 'name', 'uuid']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const totalItems = await ProviderNotification.count({
            include: [
                {
                    model: Provider, attributes: ['code', 'name', 'uuid']
                },
            ],
            where: search ? {
                [Op.or]: [
                    { accountNumber: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });

        const count = notifications.length;

        const totalPages = Math.ceil(totalItems / limit);

        return respondSuccess(res, "Transaction list retrieved", { notifications, currentPage: page, perPage: count, total: totalItems, pages: totalPages });
    };

    getPosAccount = async (req, res, next) => {
        const tid = req.params.tid;

        const accounts = await VirtualAccount.findAll({
            where: { tid },
            attributes: ['accountNumber', 'accountName', 'phoneNumber', 'tid'],
            include: [
                {
                    model: Provider,
                    attributes: ['name'],
                },
            ],
        });

        return respondSuccess(res, "Virtual account retrieved successfully", { accounts });
    }

    getAccount = async (req, res, next) => {
        const account = req.params.account;
        const channel = req.channel;
        const accounts = await VirtualAccount.findOne({
            where: { accountNumber: account, ChannelId: channel.id },
            attributes: ['accountNumber', 'accountName', 'bvn', 'phoneNumber', 'tid'],
            include: [
                {
                    model: Provider,
                    attributes: ['name'],
                },
            ],
        });

        return respondSuccess(res, "Virtual account retrieved successfully", accounts);
    }

    getPosAccountTransactions = async (req, res, next) => {
        const tid = req.params.tid;

        const transactions = await TransactionNotification.findAll({
            attributes: { exclude: ['providerNotification', 'channelResponse', 'ip', 'feeCharge', 'deletedAt', 'ChannelId'] },
            include: [
                {
                    model: VirtualAccount,
                    attributes: ['tid', 'accountNumber', 'accountName'],
                    where: { tid },
                    include: {
                        model: Provider,
                        attributes: ['name', 'code'],
                    },
                },

            ],
            order: [['createdAt', 'DESC']],
            limit: 10,
        });

        return respondSuccess(res, "Recent transactions retrieved successfully", { transactions });
    }

    getAccountTransactions = async (req, res, next) => {
        const account = req.params.account;
        const channel = req.channel;

        const transactions = await TransactionNotification.findAll({
            where: { accountNumber: account, ChannelId: channel.id },
            attributes: { exclude: ['providerNotification', 'channelResponse', 'ip', 'feeCharge', 'deletedAt', 'ChannelId'] },
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
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        return respondSuccess(res, "Recent transactions retrieved successfully", { transactions });

    }

    addPosVirtualAccount = async (req, res, next) => {

        checkValidation(req);
        let { provider: providerCode, accountName, bvn, phoneNumber, settlementAccount, tid } = req.body;

        // try {
        let account = await VirtualAccount.findOne({
            include: Provider,
            where: {
                [Op.and]: [
                    { tid },
                    {
                        '$Provider.code$': providerCode,
                    },
                ],
            },
        });

        const provider = await Provider.findOne({ where: { code: providerCode } });

        const channel = await Channel.findOne({
            where: { channelType: "merchant" },
            include: {
                model: SettlementAccount,
                limit: 1,
                where: { ProviderId: provider.id }
            }
        });

        if (!settlementAccount) {
            if (channel.SettlementAccounts.length > 0) {
                settlementAccount = channel.SettlementAccounts[0].accountNumber;
            } else {
                return respondError(res, "Settlement account must be provided");
            }
        }

        const response = await switchProviderCall(provider, channel, tid, accountName, bvn, phoneNumber, settlementAccount, req);

        if (response.error) {
            return respondError(res, response.message);
        }

        if (account) {
            account.update({ accountNumber: response.account, accountName, settlementAccount, tid });
        } else {
            account = await VirtualAccount.create({
                accountNumber: response.account,
                accountName,
                bvn,
                phoneNumber,
                settlementAccount,
                tid,
                ProviderId: provider.id,
                ChannelId: channel.id
            })
        }

        return respondSuccess(res, "Virtual account created successfully", { accountNumber: account.accountNumber, accountName: account.accountName, bvn: account.bvn, phoneNumber: account.phoneNumber, tid: account.tid, Provider: { name: provider.name } });

        // } catch (e) {
        //     logger.info(e)
        //     return respondError(res, e.message);
        // }
    }

    addVirtualAccountManually = async (req, res, next) => {
        checkValidation(req);
        const { provider: providerCode, channel: channelUUID, accountName, accountNumber, bvn, phoneNumber } = req.body;

        const channels = await Channel.findOne({
            where: { uuid: channelUUID },
            include: [
                {
                    model: SettlementAccount,
                },
            ],
        });

        const provider = await Provider.findOne({ where: { code: providerCode } });

        if (!channels || !provider) {
            return respondError(res, "Invalid channel or provider");
        }
        try {
            let account = await VirtualAccount.findOne({
                include: Provider,
                where: {
                    [Op.and]: [
                        {
                            accountNumber,
                        },
                        { ChannelId: channels.id },
                        {
                            '$Provider.code$': providerCode,
                        },
                    ],
                },
            });

            if (account) {
                return respondError(res, "Account already exist ");
            }

            let bvnAlt = bvn ?? randGen(11)
            let phoneNumberAlt = phoneNumber ?? randGen(11)
            const settlementAccount = channels.SettlementAccounts.find((e) => e.ProviderId === provider.id);


            let accountNew = await VirtualAccount.create({
                accountNumber,
                accountName,
                bvn: bvnAlt,
                phoneNumber: phoneNumberAlt,
                settlementAccount: settlementAccount.accountNumber,
                ProviderId: provider.id,
                ChannelId: channels.id
            })

            return respondSuccess(res, "Virtual account created successfully", { accountNumber: accountNew.accountNumber, accountName: accountNew.accountName, bvn: accountNew.bvn, phoneNumber: accountNew.phoneNumber, Provider: { name: provider.name } });


        } catch (e) {
            logger.info(e)
            return respondError(res, e.message);
        }
    }

    addVirtualAccount = async (req, res, next) => {
        checkValidation(req);
        const channel = req.channel;
        const { provider: providerCode, accountName, bvn, phoneNumber } = req.body;

        let providerCodeData = providerCode == "gtbank" ? "gtbank_agency" : providerCode;

        try {
            let account = await VirtualAccount.findOne({
                include: Provider,
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [{ phoneNumber }],
                        },
                        { ChannelId: channel.id },
                        {
                            '$Provider.code$': providerCodeData,
                        },
                    ],
                },
            });

            const provider = await Provider.findOne({ where: { code: providerCodeData } });
            if (!provider) {
                return respondError(res, "Invalid Provider");
            }
            const settlementAccount = channel.SettlementAccounts.find((e) => e.ProviderId === provider.id);

            if (!settlementAccount) {
                return respondError(res, "No settlement account profile for your channel yet with provider");
            }

            const response = await switchProviderCall(provider, channel, phoneNumber, accountName, bvn, phoneNumber, settlementAccount.accountNumber, req);

            if (response.error) {
                return respondError(res, response.message);
            }
            if (account) {
                account.update({ accountNumber: response.account, accountName, settlementAccount: settlementAccount.accountNumber });
            } else {
                account = await VirtualAccount.create({
                    accountNumber: response.account,
                    accountName,
                    bvn,
                    phoneNumber,
                    settlementAccount: settlementAccount.accountNumber,
                    ProviderId: provider.id,
                    ChannelId: channel.id
                })
            }

            return respondSuccess(res, "Virtual account created successfully", { accountNumber: account.accountNumber, accountName: account.accountName, bvn: account.bvn, phoneNumber: account.phoneNumber, Provider: { name: provider.name.replace(" Agency", "") } });

        } catch (e) {
            logger.info(e)
            return respondError(res, e.message);
        }
    }

    registerVirtualAccount = async (req, res, next) => {
        checkValidation(req);
        const providerCode = req.params.provider;
        const channel = req.channel;
        const { accountName, accountNumber, tid, settlementAccount, phoneNumber } = req.body;

        const provider = await Provider.findOne({ where: { code: providerCode } });
        if (!provider) {
            return respondError(res, "No provider found");
        }

        try {
            let account = await VirtualAccount.findOne({
                include: Provider,
                where: {
                    [Op.and]: [
                        { accountNumber },
                        { tid },
                        {
                            '$Provider.code$': providerCode,
                        },
                    ],
                },
            });

            if (account) {
                account.update({ accountNumber, accountName, settlementAccount, tid });
            } else {
                account = await VirtualAccount.create({
                    accountNumber,
                    accountName,
                    bvn: "N/A",
                    phoneNumber: phoneNumber ?? "N/A",
                    settlementAccount,
                    tid,
                    ProviderId: provider.id,
                    ChannelId: channel.id
                })
            }

            return respondSuccess(res, "Virtual account registered successfully");

        } catch (e) {
            logger.info(e)
            return respondError(res, e.message);
        }
    }
}
module.exports = new VirtualAccountController;