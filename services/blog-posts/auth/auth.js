const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { Post } = require('../models/index');

/* checks for the presence of a token */
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

/* checks if the token user id matches the blog post user id */
exports.canEditRequired = function(req, res, next) {
    let decoded = req.decoded;

    let postId = req.params.id;
    Post.findOne({where:{id: postId}})
        .done(function(post){
            if (decoded.user_id !== post.user_id) {
                res.status(403).json({success: false, message: 'Not Authorized, User ID Invalid'});
                return;
            }

            next();
        });
};

/* checks if token matches posts user id and if not then edit will be false */
exports.canEditOptional = function(req, res, next) {
    let token = req.headers.token;
    let postId = req.params.id;
    Post.findOne({where:{id: postId}})
        .done(function(post){
            req.authorization = {};

            if (!token) {
                req.authorization.can_edit = false;
                next();
                return;
            }

            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }

            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    req.authorization.can_edit = false;
                    next();
                    return;
                }

                if (decoded.user_id !== post.user_id) {
                    req.authorization.can_edit = false;
                    next();
                    return;
                }
                req.authorization.can_edit = true;
                next();
            });
        });
};