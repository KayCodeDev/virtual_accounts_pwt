const { Model, DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");

class TransactionNotification extends Model { }

TransactionNotification.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    fee: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
    },
    settledAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "NGN"
    },
    originator: {
        type: DataTypes.STRING,
    },
    providerNotification: {
        type: DataTypes.JSON,
    },
    channelResponse: {
        type: DataTypes.JSON,
    },
}, {
    sequelize,
    modelName: 'TransactionNotification',
    paranoid: true,
})



module.exports = TransactionNotification;