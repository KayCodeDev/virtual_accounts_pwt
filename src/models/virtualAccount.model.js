const { Model, DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");

class VirtualAccount extends Model { }

VirtualAccount.init({
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
    tid: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    sequelize,
    modelName: 'VirtualAccount',
    paranoid: true,
})



module.exports = VirtualAccount;