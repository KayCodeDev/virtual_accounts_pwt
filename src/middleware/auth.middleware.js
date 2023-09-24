const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/channel.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Channel = require('../models/channel.model');
dotenv.config();

const auth = (role) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }

            const token = authHeader.replace(bearer, '');
            if (role == "ADMIN") {
                if (token !== process.env.ADMIN_TOKEN) {
                    throw new HttpException(401, 'Authentication failed!');
                } else {
                    next();
                }
            } else if (role == "POS") {
                if (token !== process.env.POS_TOKEN) {
                    throw new HttpException(401, 'Authentication failed!');
                } else {
                    next();
                }
            } else {
                const secretKey = process.env.SECRET_JWT || "";
                const decoded = jwt.verify(token, secretKey);
                const channel = await Channel.findOne({
                    where: { id: decoded.channel_id },
                    include: [
                        {
                            model: SettlementAccount,
                        },
                    ],
                });

                if (!channel) {
                    throw new HttpException(401, 'Authentication failed. Invalid API key token');
                }

                if (!channel.SettlementAccounts.length == 0) {
                    throw new HttpException(400, 'Channel account not profiled with settlement account yet.');
                }

                req.channel = channel;
                next();
            }

        } catch (e) {
            console.log(e)
            e.status = 401;
            e.message = "Authentication failed. " + e.message;
            next(e);
        }
    }
}

module.exports = auth;