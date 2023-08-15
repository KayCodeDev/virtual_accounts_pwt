
const dotenv = require('dotenv');
const { respondSuccess, respondError, checkValidation } = require('../utils/common.utils');
const Provider = require('../models/provider.model');
dotenv.config();


class ProviderController {
    getAllProvider = async (req, res, next) => {
        let providers = await Provider.findAll({ order: [['createdAt', 'DESC']], });
        return respondSuccess(res, "provider list retrieved", { providers: providers });
    };

    addProvider = async (req, res, next) => {
        checkValidation(req);
        const { name, code, prefix, credentials } = req.body;

        try {
            await Provider.create({ name, code, prefix, credentials });

            return respondSuccess(res, "provider created successfully");

        } catch (e) {
            console.log(e)
            return respondError(res, e.message);
        }
    };

    updateProvider = async (req, res, next) => {
        checkValidation(req);
        const { credentials } = req.body;
        const uuid = req.params.uuid

        try {
            const provider = await Provider.findOne({ where: { uuid } });

            if (!provider) {
                return respondError(res, "No provider found");
            }

            provider.update({ credentials });

            return respondSuccess(res, "Provider updated successfully");

        } catch (e) {
            console.log(e)
            return respondError(res, e.message);
        }
    };




}
module.exports = new ProviderController;