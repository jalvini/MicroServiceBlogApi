'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
      author: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      tag_ids: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
  };
  return Post;
};