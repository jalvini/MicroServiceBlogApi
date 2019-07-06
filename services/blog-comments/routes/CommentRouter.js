var express = require('express');
var router = express.Router();

var comments = require('../controllers/CommentController');

router.get('/comment/:postId', comments.viewAllCommentsForPost);

router.post('/comment/:postId',  comments.createComment);

router.patch('/comment/:commentId', comments.modifyComment);

router.delete('/comment/:commentId', comments.deleteComment);

module.exports = router;
