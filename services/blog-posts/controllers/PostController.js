const { Post } = require('../models/index');

const PostParams = function(post){
    this.title = post.title;
    this.description = post.description;
    this.body = post.body;
    this.category_id = post.category_id;
};

exports.viewAllBlogPosts = function(req, res) {
    Post.findAll()
        .then(function(posts) {
            res.status(200).json({success: true, message: 'Success', data: posts});
        });
};

exports.viewBlogPost = function(req, res){
    let id = req.params.postId;

    Post.findOne({where: {id: id}})
        .done(function(post){
            res.status(200).json({success: true, message: 'Success', data: post});
        });
};

exports.viewBlogPostsByAttribute = function(req, res) {
    let id;
    let attribute;

    if (req.params.userId) {
        id = req.params.userId;
        attribute = "user_id";
    } else {
        id = req.params.categoryId;
        attribute = "category_id";
    }

    Post.findAll({where: {[attribute]: id}})
        .done(function(post){
            res.status(200).json({success: true, message: 'Success', data: post});
        });
};

exports.viewBlogPostsByTag = function(req, res) {
    // this will take in an array from tags and return posts
    req.params.tags = [10, 12];
    Post.findAll({where: { id: req.params.tags}})
        .then(function(posts) {
            res.status(200).json({success: true, message: 'Success', data: posts});
        });
};

exports.createBlogPost = function(req, res) {
    const post = new PostParams(req.body);
    const user_id = req.decoded.user_id;
    const username = req.decoded.username;

    Post.create({title: post.title, description: post.description, body: post.body,
                user_id: user_id, author: username, category_id: post.category_id})
        .then(function(){
            res.status(203).json({success: true, message: 'Post Created'});
        });
};

exports.modifyBlogPost = function(req, res){
    const postId = req.params.id;
    let postParams = new PostParams(req.body);

    Post.update(postParams, {where: {id: postId}})
        .done(function(){
            res.status(203).json({success: true, message: 'Post Modified'});
        });
};

exports.deleteBlogPost = function(req, res){
    const postId = req.params.id;

    Post.destroy({where:{id: postId}})
        .done(function(){
            res.status(203).json({success: true, message: 'Post Deleted'});
        });
};