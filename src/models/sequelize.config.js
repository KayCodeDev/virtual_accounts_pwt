const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    operatorsAliases: false,
    pool: {
        max: process.env.POOL_MAX,
        min: process.env.POOL_MIN,
        acquire: process.env.POOL_ACQUIRE,
        idle: process.env.POOL_IDLE
    }
});

const Channel = sequelize.import('./channel.model');
const Provider = sequelize.import('./provider.model');
const SettlementAccount = sequelize.import('./settlementAccount.model');
const TransactionNotification = sequelize.import('./transactionNotification.model');
const VirtualAccount = sequelize.import('./virtualAccount.model');

Channel.hasMany(VirtualAccount);
Provider.hasMany(VirtualAccount);
SettlementAccount.belongsTo(Channel);
TransactionNotification.belongsTo(VirtualAccount);
VirtualAccount.hasMany(TransactionNotification);


module.exports = { sequelize, Channel, Provider, SettlementAccount, TransactionNotification, VirtualAccount };