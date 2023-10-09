
const Channel = require('../models/channel.model');
const SettlementAccount = require('../models/settlementAccount.model');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const dotenv = require('dotenv');
const { respondSuccess, respondError, randGen, checkValidation } = require('../utils/common.utils');
const Provider = require('../models/provider.model');
dotenv.config();


class ChannelController {
    getAllChannels = async (req, res, next) => {
        const page = req.query.page ?? 1;
        const perpage = req.query.perpage ?? 15;
        const search = req.query.search ?? null;

        const offset = (page - 1) * perpage;
        let channelList = await Channel.findAll({
            include: [{
                model: SettlementAccount,
                attributes: ['uuid', 'accountNumber', 'accountName', 'status'],
                include: [
                    {
                        model: Provider,
                        attributes: ['name', 'code'],

                    }
                ]
            }
            ],
            offset,
            limit: perpage,
            order: [['createdAt', 'DESC']],
            where: search ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { channelType: { [Op.like]: `%${search}%` } },
                ],
            } : null,
        });
        return respondSuccess(res, "channel list retrieved", { channels: channelList });
    };

    addChannel = async (req, res, next) => {
        checkValidation(req);
        const { name, email, channelType, webhookUrl, bearer, feeCharge, prefix } = req.body;

        // if (channelType == "merchant") {
        //     if (await Channel.findOne({ where: { channelType } })) {
        //         return respondError(res, "Merchant channel already exists")
        //     }
        // }

        if (!prefix) {
            prefix = randGen(3);
        }
        try {
            const channel = await Channel.create({ name, email, channelType, webhookUrl, bearer, feeCharge, feeCap, prefix });

            const secretKey = process.env.SECRET_JWT || "";
            const token = jwt.sign({ channel_id: channel.id.toString() }, secretKey, {
                expiresIn: '10y'
            });

            channel.update({ apiKey: token });

            return respondSuccess(res, "channel created successfully", { uuid: channel.uuid, apiKey: token, channelName: channel.name, prefix: channel.prefix });

        } catch (e) {
            console.log(e)
            return respondError(res, e.message);
        }
    };

    updateChannel = async (req, res, next) => {
        checkValidation(req);

        const { channelUUID, webhookUrl, bearer, feeCharge, feeCap } = req.body;

        const channel = await Channel.findOne({ where: { uuid: channelUUID } });

        if (webhookUrl) {
            channel.webhookUrl = webhookUrl;
        }

        if (bearer) {
            channel.bearer = bearer;
        }

        if (feeCharge) {
            channel.feeCharge = feeCharge;
        }

        if (feeCap) {
            channel.feeCap = feeCap;
        }

        await channel.save();

        return respondSuccess(res, "channel updated successfully");


    }

    addChannelAccount = async (req, res, next) => {
        checkValidation(req);

        try {
            const { channelUUID, provider: code, settlementAccount, settlementAccountName } = req.body;

            const channel = await Channel.findOne({ where: { uuid: channelUUID } });

            const provider = await Provider.findOne({ where: { code } });

            let exist = await SettlementAccount.findOne({ where: { ProviderId: provider.id, ChannelId: channel.id } });

            let msg = "channel account added successfully";
            if (exist) {
                exist.accountNumber = settlementAccount;
                exist.accountName = settlementAccountName;
                await exist.save();
                msg = "channel account updated successfully";
            } else {
                exist = await SettlementAccount.create({ ChannelId: channel.id, ProviderId: provider.id, accountNumber: settlementAccount, accountName: settlementAccountName });
            }

            return respondSuccess(res, msg);
        } catch (e) {
            console.log(e);
            return respondError(res, "Unable to add settlement account, try again")
        }
    }

}
module.exports = new ChannelController;