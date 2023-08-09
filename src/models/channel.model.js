const { Model, DataTypes } = require('sequelize');
const sequelize = require("./sequelize.config");

class Channel extends Model { }

Channel.init({
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
    collected: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    },
    channelType: {
        type: DataTypes.ENUM('merchant', 'tp'),
        defaultValue: "merchant"
    },
    webhookUrl: {
        type: DataTypes.STRING,
    },
    bearer: {
        type: DataTypes.STRING,
    },
    prefix: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'Channel',
    paranoid: true,
})



module.exports = Channel;