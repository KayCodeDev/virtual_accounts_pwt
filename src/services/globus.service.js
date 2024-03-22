const common = require("../utils/common.utils");
const qs = require('querystring');
const FormData = require('form-data');
const logger = require("../utils/logger.utils");

class GlobusService {

    createVirtualAccount = async (provider, identifier, accountName, phoneNumber, bvn, settlementAccount) => {
        const account = identifier + common.randGen(7);

        const data = {
            AccountName: accountName,
            LinkedPartnerAccountNumber: provider.credentials.linkedPartnerAccountNumber,
            VirtualAccountNumber: account,
            CanExpire: false,
            ExpiredTime: 0,
            hasTransactionAmount: false,
            TransactionAmount: 0
        }


        const token = await this.__generateAccessToken(provider);

        if (token == null) {
            return { error: true, message: "Unable to create virtual account" }
        }

        const headers = {
            Authorization: "Bearer " + token,
            ClientID: provider.credentials.cliendID ?? "",
            "Content-Type": "application/json"
        }

        const url = provider.credentials.baseUrl + "api/Account/generateVirtualAccountLite";

        logger.info("sending request to Globus for virtual account")
        logger.info(headers);
        logger.info(data)
        logger.info(url)

        const response = await common.sendPost(url, data, { headers });

        logger.info("Response from Globus for virtual account:" + accountName)
        logger.info({ response: response });

        if (response?.hasOwnProperty('responseCode') && response.responseCode == "00") {
            return { error: false, account: response.result.virtualAccount ?? account };
        }

        return { error: true, message: response?.responseMessage ?? "Unable to create virtual account" }

    }


    __generateAccessToken = async (provider) => {
        const password = common.toSha256(provider.credentials.password);
        const username = common.toSha256(common.nowDate('yyyyMMdd') + provider.credentials.cliendID);

        let formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('client_id', provider.credentials.cliendID ?? "");
        formData.append('client_secret', provider.credentials.cliendSecret ?? "");
        formData.append('scope', provider.credentials.scope ?? "");

        const url = provider.credentials.tokenUrl;

        const headers = {
            ...formData.getHeaders()
        }

        logger.info("sending request to Globus for Generate token");
        logger.info(url)
        const result = await common.sendPost(url, formData, { headers });
        const response = result;
        logger.info("response from Globus for Generate token");
        logger.info({ response: response });

        if (response != undefined && response.hasOwnProperty('access_token')) {
            return response.access_token;
        }

        return null;
    }

}

module.exports = new GlobusService;