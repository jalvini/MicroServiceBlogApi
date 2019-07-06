var express = require('express');
var router = express.Router();

var comments = require('../controllers/CommentController');


router.get('/category/:categoryId', posts.viewAllBlogPosts);

router.post('/categories/create', posts.viewAllBlogPosts);

router.patch('category/:categoryId');

router.delete('category/:categoryId');