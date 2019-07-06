var express = require('express');
var router = express.Router();
const authorize = require('../auth/auth');


var posts = require('../controllers/PostController');

/* GET all post listings. */
router.get('/posts', posts.viewAllBlogPosts);

/* GET post listing. */
router.get('/post/:postId', authorize.canEditOptional, posts.viewBlogPost);

/* GET all user posts. */
router.get('/posts/user/:userId', posts.viewBlogPostsByAttribute);

/* GET all category posts. */
router.get('/posts/category/:categoryId', posts.viewBlogPostsByAttribute);

/* POST blog post listing. */
router.post('/post/create', authorize.user, posts.createBlogPost);

/* PATCH post listing. */
router.patch('/post/:id', authorize.user, authorize.canEditRequired, posts.modifyBlogPost);

/* DELETE post listing. */
router.delete('/post/:id', authorize.canEditRequired, posts.deleteBlogPost);

module.exports = router;
