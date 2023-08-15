const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const VirtualAccount = require('./virtualAccount.model');

const TransactionNotification = sequelize.define('TransactionNotification', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    settledAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    feeCharge: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
    },
    description: {
        type: DataTypes.STRING,
    },
    transactionDate: {
        type: DataTypes.STRING,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "NGN"
    },
    originator: {
        type: DataTypes.STRING,
    },
    ip: {
        type: DataTypes.STRING,
    },
    providerNotification: {
        type: DataTypes.JSON,
    },
    channelResponse: {
        type: DataTypes.JSON,
    },
}, {
    tableName: 'transaction_notifications',
    paranoid: true,
});

module.exports = TransactionNotification;