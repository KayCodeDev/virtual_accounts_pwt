const net = require("net");
const dotenv = require('dotenv');
const socketManager = require("./utils/socket.manager");
const logger = require("./utils/logger.utils");

dotenv.config();

class SocketServer {

    startServer = () => {
        const socketServer = net.createServer((socket) => {
            logger.info('TCP client connected:', socket.remoteAddress, socket.remotePort);
            socket.on("data", async (data) => {
                const message = data.toString();
                logger.info('Received TCP data:', message);

                try {
                    const jsonData = JSON.parse(message);
                    if (typeof jsonData === 'object' || jsonData !== null) {
                        if (jsonData.hasOwnProperty('action') && jsonData.action === "joining" && jsonData.hasOwnProperty('tid')) {
                            const key = `${socket.remoteAddress}:${socket.remotePort}`;
                            socketManager.addSocket(key, jsonData.tid, socket);
                            socket.write(`Connected from ${socket.remoteAddress}:${socket.remotePort}`);
                        } else if (jsonData.hasOwnProperty('action') && jsonData.action === "ping" && jsonData.hasOwnProperty('tid')) {
                            const key = `${socket.remoteAddress}:${socket.remotePort}`;
                            socketManager.updateSocketByTID(key, jsonData.tid, socket);
                            socket.write(`pong`);
                        } else {
                            socket.write(`Unable to connect, expected action not sent. Attempted to connected from ${socket.remoteAddress}:${socket.remotePort}`);
                            socket.end();
                        }
                    }
                } catch (e) {
                    logger.info('Error parsing JSON data:', e.message);
                    socket.end();
                }
            });

            socket.on("end", () => {
                logger.info('TCP client disconnected:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("close", () => {
                logger.info('TCP client closed:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("timeout", () => {
                logger.info('TCP client timeout:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("error", (err) => {
                logger.info('TCP client Error:', socket.remoteAddress, socket.remotePort, err);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });
        });

        const port = Number(process.env.SOCKET_PORT || 3301);

        socketServer.listen(port, () => {
            logger.info(`🔌 Socket Server running on ${port}`);
        });
    }

}

module.exports = new SocketServer;