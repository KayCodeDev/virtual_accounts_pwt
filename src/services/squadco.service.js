const common = require("../utils/common.utils");

class SquadcoService {

    createVirtualAccount = async (provider, identifier, accountName, phoneNumber, bvn, settlementAccount) => {
        const data = {
            customer_identifier: identifier,
            business_name: accountName,
            mobile_num: phoneNumber,
            bvn: bvn,
            beneficiary_account: settlementAccount
        }

        const url = provider.credentials.baseUrl;
        const key = provider.credentials.secretKey;
        const headers = {
            Authorization: "Bearer " + key,
            "Content-Type": "application/json"
        }

        console.log("sending request to GTBank Squadco for virtual account")

        const response = await common.sendPost(url, data, { headers });

        if (response?.hasOwnProperty('success') && response.success) {
            return { error: false, account: response.data.virtual_account_number };
        }

        return { error: true, message: response?.message ?? "Unable to create virtual account" }
    }
}

module.exports = new SquadcoService;