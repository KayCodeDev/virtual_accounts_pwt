const common = require("../utils/common.utils");
const logger = require("../utils/logger.utils");

class SquadcoService {

    createVirtualAccount = async (provider, identifier, accountName, phoneNumber, bvn, settlementAccount, req) => {

        var data = {};
        var url = "";
        if (provider.code == "gtbank_agency") {
            const fullname = accountName.split(" ");
            data = {
                customer_identifier: "CPL-PWT-" + identifier,
                first_name: fullname[0],
                last_name: fullname[1],
                mobile_num: phoneNumber,
                bvn: bvn,
                beneficiary_account: settlementAccount,
                email: req.body.email,
                dob: req.body.dob,
                address: req.body.address,
                gender: req.body.gender == "male" ? "1" : "2"
            }

            url = provider.credentials.baseUrl.replace("/business", "");
        } else {
            data = {
                customer_identifier: "CPL-PWT-" + identifier,
                business_name: accountName,
                mobile_num: phoneNumber,
                bvn: bvn,
                beneficiary_account: settlementAccount
            }

            url = provider.credentials.baseUrl;
        }

        const key = provider.credentials.secretKey;
        const headers = {
            Authorization: "Bearer " + key,
            "Content-Type": "application/json"
        }

        logger.info("sending request to GTBank Squadco for virtual account")
        logger.info(headers);
        logger.info(data)
        logger.info(url)

        const response = await common.sendPost(url, data, { headers });

        logger.info("Response from GTBank for virtual account:" + accountName)
        logger.info({ response: response });

        if (response?.hasOwnProperty('success') && response.success) {
            return { error: false, account: response.data.virtual_account_number };
        }

        return { error: true, message: response?.message ?? "Unable to create virtual account" }
    }
}

module.exports = new SquadcoService;