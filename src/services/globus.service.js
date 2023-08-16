const common = require("../utils/common.utils");
const FormData = require('form-data');

class GlobusService {

    createVirtualAccount = async (provider, identifier, accountName, phoneNumber, bvn, settlementAccount) => {
        const account = identifier + common.randGen(7);

        const data = {
            AccountName: accountName,
            LinkedPartnerAccountNumber: settlementAccount,
            VirtualAccountNumber: account,
            CanExpire: "false",
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

        console.log("sending request to Globus Squadco for virtual account")

        const response = await common.sendPost(url, data, { headers });

        console.log(response);
        if (response?.hasOwnProperty('responseCode') && response.responseCode == "00") {
            return { error: false, account: response.result.virtualAccount ?? account };
        }

        return { error: true, message: response?.responseMessage ?? "Unable to create virtual account" }

    }


    __generateAccessToken = async (provider) => {
        const password = common.toSha256(provider.credentials.password);
        const username = common.toSha256(common.nowDate() + provider.credentials.cliendID);

        const form = new FormData();
        form.append('grant_type', 'password');
        form.append('username', username);
        form.append('password', password);
        form.append('client_id', provider.credentials.cliendID ?? "");
        form.append('client_secret', provider.credentials.cliendSecret ?? "");
        form.append('scope', provider.credentials.scope ?? "");
        // const data = {
        //     grant_type: "password",
        //     username,
        //     password,
        //     client_id: provider.credentials.cliendID ?? "",
        //     client_secret: provider.credentials.cliendSecret ?? "",
        //     scope: provider.credentials.scope ?? ""
        // }
        const url = provider.credentials.tokenUrl;

        const headers = {
            ...form.getHeaders()
        }

        console.log("sending request to Globus for Generate token");

        const response = await common.sendPost(url, form, { headers });

        if (response != undefined && response.hasOwnProperty('access_token')) {
            return response.access_token;
        }

        return null;
    }

}

module.exports = new GlobusService;