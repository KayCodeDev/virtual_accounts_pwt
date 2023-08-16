const common = require("../utils/common.utils");
const socketManager = require("../utils/socket.manager");

class NotificationService {

    sendWebhook = async (account, notification, provider) => {
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

        console.log("sending webhook notification to Channel [" + account.Channel.name + " (" + account.Channel.webhookUrl + "]")

        const response = await common.sendPost(url, data, { headers });

        await notification.update({ channelResponse: response })
    }

    sendSocket = (account, notification) => {

        notification.tid = account.tid;

        try {
            const socket = socketManager.getSocketByTID(account.tid);
            if (socket !== undefined) {
                socket.write(JSON.stringify(notification))
                console.info(`Data sent to ${account.tid} on socket`);
            } else {
                console.error(`No socket connection found for ${account.tid}`);
            }

        } catch (e) {
            console.log(e);
            console.log("unable to send socket notification")
        }

    }
}

module.exports = new NotificationService;