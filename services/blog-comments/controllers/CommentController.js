const { Comments } = require('../models/index');

const CommentParams = function(comment){
    this.title = comment.title;
    this.body = comment.body;
    this.author = comment.author;
};

exports.viewAllCommentsForPost = function(req, res) {
    // this will take in an array from tags and return comments
    Comments.findAll({where: { id: req.params.commentId}})
        .then(function(comments) {
            res.status(200).json({success: true, message: 'Success', data: comments});
        });
};

exports.createComment = function(req, res) {
    const comment = new CommentParams(req.body);
    const postId = req.params.postId;
    Comments.create({title: comment.title, author: comment.author, body: comment.body, post_id: postId})
        .then(function() {
            res.status(200).json({success: true, message: 'Comment Created'});
        });
};

exports.modifyComment = function(req, res){
    const commentId = req.params.commentId;
    let commentParams = new CommentParams(req.body);

    Comments.update(commentParams, {where: {id: commentId}})
        .done(function(){
            res.status(200).json({success: true, message: 'Comment Modified'});
        });
};

exports.deleteComment = function(req, res){
    const commentId = req.params.commentId;

    Comments.destroy({where:{id: commentId}})
        .done(function(){
            res.status(200).json({success: true, message: 'Comment Deleted'});
        });
};