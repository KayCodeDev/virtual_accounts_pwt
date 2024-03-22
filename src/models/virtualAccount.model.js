const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const TransactionNotification = require('./transactionNotification.model');
const { commonAttributes } = require('./attributes');

const VirtualAccount = sequelize.define('VirtualAccount', {
    ...commonAttributes,
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bvn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    received: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
    },
    settlementAccount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tid: {
        type: DataTypes.STRING,
    },

    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    tableName: 'virtual_accounts',
    paranoid: true,
})

VirtualAccount.hasMany(TransactionNotification);
TransactionNotification.belongsTo(VirtualAccount);

module.exports = VirtualAccount;