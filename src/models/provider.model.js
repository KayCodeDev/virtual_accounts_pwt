const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const VirtualAccount = require('./virtualAccount.model');
const SettlementAccount = require('./settlementAccount.model');

const Provider = sequelize.define('Provider', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    received: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    prefix: {
        type: DataTypes.STRING,
    },
    credentials: {
        type: DataTypes.JSON,

    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    tableName: 'providers',
    paranoid: true,
});

Provider.hasMany(VirtualAccount);
VirtualAccount.belongsTo(Provider)

Provider.hasMany(SettlementAccount);
SettlementAccount.belongsTo(Provider);

module.exports = Provider;