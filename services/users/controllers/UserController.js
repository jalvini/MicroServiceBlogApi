const { User } = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let jwt = require('jsonwebtoken');
let bCrypt = require('bcrypt');

const UserParams = function(userParams) {
    this.user_id = userParams.id;
    this.username = userParams.username;
    this.email = userParams.email;
    this.password = userParams.password;
    this.access_level = userParams.access_level;
    this.first_name = userParams.first_name;
    this.last_name = userParams.last_name;
};

/* Gets user from route GET '/user/:id' authorize.userIdOptional */
exports.getSingleUser = function(req, res) {
    let user_id = req.params.id;
    User.findOne({
        where: {id: user_id},
        attributes: ['username', 'first_name', 'last_name', 'createdAt']
    }).then(user => {
        if (!user) {
            res.status(403).json({success: false, message: 'User Does Not Exist'});
            return;
        }

        user.dataValues.can_edit = req.authorization.is_user;
        res.status(200).json({success: true, message: 'Success', data: user});
    })
};

/* Logs in user from route POST '/user' */
exports.loginUser = function(req, res) {
    let returning_user = new User(req.body);

    if (!returning_user.username) {
        res.status(403).json({success: false, message: 'Username Cannot Be Null'});
        return;
    }

    User.findOne({
        where: {[Op.or]:[{username: returning_user.username}, {email: returning_user.username}]},
        attributes: ['id', 'username', 'password']
    }).then(user => {

        if (!user) {
            res.status(403).json({success: false, message: 'Username Does Not Exist'});
            return;
        }

        if (bCrypt.compareSync(returning_user.password, user.password)) {
            let token = jwt.sign({user_id: user.id, username: user.username, access_level: "user"},
                config.secret,
                { expiresIn: '24h' }
            );

            res.status(200).json({success: true, message: 'Authentication successful!', token: token});
        } else {
            res.status(403).json({success: false, message: 'Password Is Not a Match'});
        }
    });
};

/* Registers user from route POST '/user/create' */
exports.registerUser = function(req, res) {
    let new_user = new User(req.body);

    if (!new_user.username || !new_user.email || !new_user.password) {
        res.status(403).json({success: false, message: 'Please Provide Username, Email And Password'});
        return;
    }

    new_user.password = bCrypt.hashSync(new_user.password, 10);

    User.findOrCreate({where: {[Op.or]:[{username: new_user.username}, {email:new_user.email}]},
                               defaults:{username: new_user.username, email:  new_user.email,
                                         password: new_user.password, access_level: 'user'}})
        .then(([user, created]) => {
            if(!created){
                if (new_user.username === user.username) {
                    res.status(403).json({success: false, message: 'Username Already Exists!'});
                    return;
                }

                if (new_user.email === user.email) {
                    res.status(403).json({success: false, message: 'Email Already Exists!'});
                    return;
                }
            }

            let token = jwt.sign({user_id: user.id, username: user.username,  access_level: "user"},
                config.secret,
                { expiresIn: '24h' }
            );

            res.status(200).json({success: true, message: 'Registration successful!', token: token});
        });
};

/* Modifies user from route PATCH '/user/:id' uses authorize.user, authorize.userId */
exports.modifyUser = function(req, res) {
    let payload_user_id = req.decoded.user_id;
    let user = new UserParams(req.body);

    User.update(user, {where: {id: payload_user_id}})
        .then(function(rowsUpdated) {
            res.status(200).json({success: true, message: 'User Changed', data: rowsUpdated});
        });
};

/* Removes user from route DELETE '/user/:id' authorize.user, authorize.userId */
exports.removeUser = function(req, res) {
    let payload_user_id = req.decoded.user_id;

    User.destroy({where: {id: payload_user_id}})
        .then(function(rowsUpdated) {
            res.status(200).json({success: true, message: 'User Changed', data: rowsUpdated});
        });
};

/* Gets all users from route GET '/users' */
exports.getAllUsers = function(req, res) {
    User.findAll({attributes:['username', 'first_name', 'last_name', 'access_level', 'createdAt'], limit: 10 })
        .then(function(users) {
            res.status(200).json({success: true, message: 'Success', data: users});
        });
};