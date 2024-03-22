const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const { commonAttributes } = require('./attributes');

const SettlementAccount = sequelize.define('SettlementAccount', {
    ...commonAttributes,
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: false
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    tableName: 'settlement_accounts',
    paranoid: true,
})



module.exports = SettlementAccount;