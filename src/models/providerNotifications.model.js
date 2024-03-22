const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const { commonAttributes } = require('./attributes');

const ProviderNotification = sequelize.define('ProviderNotification', {
    ...commonAttributes,
    ip: {
        type: DataTypes.STRING,
    },
    accountNumber: {
        type: DataTypes.STRING,
    },
    notification: {
        type: DataTypes.JSON,
    },
    appstatus: {
        type: DataTypes.ENUM('pending', 'processed', 'failed'),
        defaultValue: "pending"
    },
    status: {
        type: DataTypes.ENUM('pending', 'processed', 'failed'),
        defaultValue: "pending"
    }
}, {
    tableName: 'provider_notifications',
    paranoid: true,
});

module.exports = ProviderNotification;