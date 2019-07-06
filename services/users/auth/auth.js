const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

exports.user = function(req, res, next) {
    let token = req.headers.token;

    if (!token) {
        res.status(403).json({success: false, message: 'No Token Supplied, Please Login'});
        return;
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            res.status(403).json({success: false, message: err.message});
            return;
        }

        req.decoded = decoded;
        next();
    });
};

exports.userId = function(req, res, next) {
    let decoded = req.decoded;
    let urlUserId =  parseInt(req.params.id);
    console.log(req.decoded);

    if (decoded.user_id !== urlUserId) {
        res.status(403).json({success: false, message: 'Not Authorized, User ID Invalid'});
        return;
    }

    next();
};

exports.admin = function(req, res, next) {
    let decoded = req.decoded;
    let admin = 'admin';

    if (decoded.access_level !== admin) {
        res.status(403).json({success: false, message: 'Not Authorized, Must Be An Admin'});
        return
    }

    next();
};

exports.userIdOptional = function(req, res, next) {
    let token = req.headers.token;
    let urlUserId =  parseInt(req.params.id);

    req.authorization = {};

    if (!token) {
        req.authorization.is_user = false;
        next();
        return;
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            req.authorization.is_user = false;
            next();
            return;
        }

        if (decoded.user_id !== urlUserId) {
            req.authorization.is_user = false;
            next();
            return;
        }
        req.authorization.is_user = true;
        next();
    });
};