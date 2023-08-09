const axios = require('axios');

exports.sendPost = (url, data, options) => {
    axios.post(url, data, options)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            return error.data;
        });
}

exports.sendGet = (url, options) => {
    axios.get(url, options)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            return error.data;
        });
}