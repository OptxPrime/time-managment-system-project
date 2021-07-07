var jwt = require('jsonwebtoken');

var secretKey = 'jedanOdGlupljihSecretKeyova';

function isObjectNullOrUndefined(object) {
    if (object === undefined || object === null) {
        return true;
    } else {
        return false;
    }
}

function isStringNullOrEmpty(str) {
    if (str === undefined || str === null || str === '') {
        return true;
    } else {
        return false;
    }
}

function generateToken(configurations) {
    if (isObjectNullOrUndefined(configurations)) {
        throw new Error('Arguments to create token are not valid.');
    }
    return jwt.sign(configurations.data, secretKey, configurations.expireDate);
}

function isTokenValid(req) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (isStringNullOrEmpty(token)) {
        // throw new Error('Given token is null or empty.');
        return false;
    }

    try {
        jwt.verify(token, secretKey);
        return true;
    } catch (err) {
        return false;
    }
}

function getTokenData(token) {
    if (isStringNullOrEmpty(token)) {
        throw new Error('Given token is null or empty.');
    }

    try {
        const decodedObject = jwt.verify(token, secretKey, { complete: true });
        return decodedObject;
    } catch (err) {
        throw err;
    }
}

function getConfigurations(dataModel) {
    const configurations = {
        data: dataModel,
        secretKey: 'TW9zaGVFcmV6UHJpdmF0ZUtleQ==',
        expireDate: {
            expiresIn: '7d'
        }
    };

    return configurations;
}

function checkIsLoggedIn(req){
    if( !req.headers.authorization ) return false;
    return true;
}

function checkIsAdminOrUserManager(req) {

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    try {
        const currentUser = getTokenData(token).payload;
        if (currentUser.role === 'admin' || currentUser.role === 'user manager') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

function checkIsSpecificRole(req, role){
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    try {
        const currentUser = getTokenData(token).payload;
        if (currentUser.role === role) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

module.exports = {
    generateToken,
    isTokenValid,
    getTokenData,
    getConfigurations,
    checkIsAdminOrUserManager,
    checkIsLoggedIn,
    checkIsSpecificRole,
};