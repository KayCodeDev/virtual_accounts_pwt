const { Model, DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");

class Provider extends Model { }

Provider.init({
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
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: "active"
    },
}, {
    sequelize,
    modelName: 'Provider',
    paranoid: true,
})



module.exports = Provider;