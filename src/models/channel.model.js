const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const VirtualAccount = require('./virtualAccount.model');
const SettlementAccount = require('./settlementAccount.model');
const TransactionNotification = require('./transactionNotification.model');

const Channel = sequelize.define('Channel', {

    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    channelType: {
        type: DataTypes.ENUM('merchant', 'tp'),
        defaultValue: "merchant"
    },
    collected: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    settled: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    feeCharge: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    feeCap: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    webhookUrl: {
        type: DataTypes.STRING,
    },
    apiKey: {
        type: DataTypes.STRING,
    },
    bearer: {
        type: DataTypes.STRING,
    },
    prefix: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'channels',
    paranoid: true,
});

Channel.hasMany(VirtualAccount);
VirtualAccount.belongsTo(Channel);

Channel.hasMany(TransactionNotification);
TransactionNotification.belongsTo(Channel);

Channel.hasMany(SettlementAccount);
SettlementAccount.belongsTo(Channel);

module.exports = Channel;