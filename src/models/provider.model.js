const { DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");
const VirtualAccount = require('./virtualAccount.model');
const SettlementAccount = require('./settlementAccount.model');
const ProviderNotification = require('./providerNotifications.model')
const { commonAttributes } = require('./attributes');

const Provider = sequelize.define('Provider', {
    ...commonAttributes,
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
        get() {
            const credentialsString = this.getDataValue('credentials');
            try {
                return credentialsString ? JSON.parse(credentialsString) : null;
            } catch (error) {
                logger.info('Error parsing credentials JSON:', error);
                return null;
            }
        },
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

Provider.hasMany(ProviderNotification);
ProviderNotification.belongsTo(Provider)

Provider.hasMany(SettlementAccount);
SettlementAccount.belongsTo(Provider);

module.exports = Provider;