'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    access_level: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};