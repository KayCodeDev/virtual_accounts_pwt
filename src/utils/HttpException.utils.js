class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status.toString();
        this.message = message;
        this.data = data;
    }
}

module.exports = HttpException;