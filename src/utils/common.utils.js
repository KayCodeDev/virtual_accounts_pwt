const axios = require('axios');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { parseISO, parse, format } = require('date-fns')

const HttpException = require('./HttpException.utils');
const squadcoService = require('../services/squadco.service');
const globusService = require('../services/globus.service');

exports.sendPost = async (url, data, options) => {
    return axios.post(url, data, options)
        .then((response) => {
            console.log(response);
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            return error.data;
        });
}

exports.sendGet = async (url, options) => {
    return axios.get(url, options)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error.data);
            return error.data;
        });
}

exports.respondSuccess = (res, message, data) => {
    let response = {
        status: "success",
        message,
        data
    }

    return res.status(200).send(response);
}

exports.respondError = (res, message) => {
    let response = {
        status: "error",
        message,
    }

    return res.status(400).send(response);
}

exports.randGen = (numDigits) => {
    let min = Math.pow(10, numDigits - 1);
    let max = Math.pow(10, numDigits) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, errors.errors[0].msg);
    }
}

exports.toSha256 = (value) => {
    const hash = crypto.createHash('sha256');
    return hash.update(value).digest('hex');
}

exports.toSha512 = (value, secret) => {
    const hash = crypto.createHmac('sha512', secret);
    return hash.update(value).digest('hex');
}

exports.formatDate = (value) => {
    let parsedDate = new Date();
    try {
        parsedDate = parseISO(value);
    } catch (e) {
        parsedDate = parse(value, 'MM/dd/yyyy HH:mm:ss', new Date());
    }

    return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
}

exports

exports.nowDate = (formatVal = "yyyy-MM-dd") => {
    const currentDate = new Date();
    return format(currentDate, formatVal);
}

exports.switchProviderCall = async (provider, channel, identifier, accountName, bvn, phoneNumber, settlementAccount) => {
    switch (provider.code) {
        case "gtbank":
            return await squadcoService.createVirtualAccount(provider, identifier, accountName, phoneNumber, bvn, settlementAccount);
        case "globus":
            identifier = channel.prefix;
            return await globusService.createVirtualAccount(provider, identifier, accountName, phoneNumber, bvn, settlementAccount);
    }
}