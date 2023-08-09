const { Model, DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");

class SettlementAccount extends Model { }

SettlementAccount.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    sequelize,
    modelName: 'SettlementAccount',
    paranoid: true,
})



module.exports = SettlementAccount;