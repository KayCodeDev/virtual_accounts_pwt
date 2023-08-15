const net = require("net");
const dotenv = require('dotenv');
const socketManager = require("./utils/socket.manager");

dotenv.config();

class SocketServer {

    startServer = () => {
        const socketServer = net.createServer((socket) => {
            console.log('TCP client connected:', socket.remoteAddress, socket.remotePort);
            socket.on("data", async (data) => {
                const message = data.toString();
                console.log('Received TCP data:', message);

                try {
                    const jsonData = JSON.parse(message);
                    if (typeof jsonData === 'object' || jsonData !== null) {
                        if (jsonData.hasOwnProperty('action') && jsonData.action === "joining" && jsonData.hasOwnProperty('tid')) {
                            const key = `${socket.remoteAddress}:${socket.remotePort}`;
                            socketManager.addSocket(key, jsonData.tid, socket);
                            socket.write(JSON.stringify({ message: `Connected from ${socket.remoteAddress}:${socket.remotePort}` }));
                        }
                    }
                } catch (e) {
                    console.error('Error parsing JSON data:', e.message);
                    socket.end();
                }
            });

            socket.on("end", () => {
                console.log('TCP client disconnected:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("close", () => {
                console.log('TCP client closed:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("timeout", () => {
                console.log('TCP client timeout:', socket.remoteAddress, socket.remotePort);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });

            socket.on("error", (err) => {
                console.log('TCP client Error:', socket.remoteAddress, socket.remotePort, err);
                const key = `${socket.remoteAddress}:${socket.remotePort}`;
                socketManager.removeSocket(key);
            });
        });

        const port = Number(process.env.SOCKET_PORT || 3301);

        socketServer.listen(port, () => {
            console.log(`🔌 Socket Server running on ${port}`);
        });
    }

}

module.exports = new SocketServer;