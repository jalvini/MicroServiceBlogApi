'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT,
    post_id: DataTypes.INTEGER
  }, {});
  Comments.associate = function(models) {
    // associations can be defined here
  };
  return Comments;
};