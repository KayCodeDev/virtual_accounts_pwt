class SocketManager {
    constructor() {
        this.sockets = [];
    }

    addSocket(key, tid, socket) {
        const index = this.sockets.findIndex(item => item.tid === tid);

        if (index !== -1) {
            this.sockets.splice(index, 1);
        }
        const data = {
            key,
            socket,
            tid
        }
        this.sockets.push(data);
    }

    removeSocket(key) {
        const index = this.sockets.findIndex(item => item.key === key);

        if (index !== -1) {
            this.sockets.splice(index, 1);
        }
    }

    getSocketByTID(tid) {
        const index = this.sockets.findIndex(item => item.tid === tid);
        if (index !== -1) {
            return this.sockets[index].socket;
        }
        return undefined;
    }

    updateSocketByTID(key, tid, socket) {
        const index = this.sockets.findIndex(item => item.tid === tid);

        const data = {
            key: key,
            socket: socket,
            tid: tid
        }

        if (index !== -1) {
            this.sockets.splice(index, 1);
        }

        this.sockets.push(data);
    }

    getSocketByKey(key) {
        const index = this.sockets.findIndex(item => item.key === key);
        if (index !== -1) {
            return this.sockets[index].socket;
        }
        return undefined;
    }
}

module.exports = new SocketManager();