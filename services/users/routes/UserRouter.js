const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authorize = require('../auth/auth');

/* GET all users */
router.get('/users',  userController.getAllUsers);

/* LOGIN single user */
router.post('/user',  userController.loginUser);

/* GET single user */
router.get('/user/:id',  authorize.userIdOptional, userController.getSingleUser);

/* CREATE user */
router.post('/user/create', userController.registerUser);

/* EDIT users */
router.patch('/user/:id', authorize.user, authorize.userId, userController.modifyUser);

/* DELETE users */
router.delete('/user/:id', authorize.user, authorize.userId, userController.removeUser);

module.exports = router;