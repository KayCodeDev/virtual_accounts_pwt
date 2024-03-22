const common = require("../utils/common.utils");
const socketManager = require("../utils/socket.manager");
const logger = require("../utils/logger.utils");

class NotificationService {

    sendWebhook = async (account, notification, providerNotification) => {
        const data = {
            status: "success",
            message: "Virtual account transaction notification",
            event: "transaction",
            data: notification
        }

        const url = account.Channel.webhookUrl;
        const headers = {
            Authorization: "Bearer " + account.Channel.bearer,
            "Content-Type": "application/json"
        }

        logger.info("sending webhook notification to Channel [" + account.Channel.name + " (" + account.Channel.webhookUrl + ")]")

        const result = await common.sendPost(url, data, { headers });

        const response = result.data;

        await notification.update({ channelResponse: response })

        if (result.status == 200) {
            providerNotification.update({ status: 'processed' })
        } else {
            providerNotification.update({ status: 'failed' })
        }
    }

    sendSocket = (account, notification, providerNotification) => {

        try {
            const socket = socketManager.getSocketByTID(account.tid);
            if (socket !== undefined) {
                socket.write(JSON.stringify(notification))
                logger.info(`Data sent to ${account.tid} on socket`);
                providerNotification.update({ status: 'processed' })
            } else {
                providerNotification.update({ status: 'failed' })
                logger.info(`No socket connection found for ${account.tid}`);
            }

        } catch (e) {
            logger.info(e);
            logger.info("unable to send socket notification")
        }

    }

    sendAgencySocket = async (walletId, notification) => {

        try {
            const socket = socketManager.getSocketByTID(walletId);
            if (socket !== undefined) {
                socket.write(JSON.stringify(notification))
                return { success: true, message: `Data sent to ${walletId} on socket agency` };
            } else {
                return { success: false, message: `No socket connection found for ${walletId} agency` };
            }

        } catch (e) {
            logger.info(e);
            return { success: false, message: e.message ?? "unable to send socket notification" };
        }

    }
}

module.exports = new NotificationService;