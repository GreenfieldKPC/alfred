'use strict';
const passportLocalSequelize = require('passport-local-sequelize');
// const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
       primaryKey: true,
         autoIncrement: true,
    },
    username: DataTypes.STRING,
    name_first: DataTypes.STRING,
    name_last: DataTypes.STRING,
    phone: DataTypes.NUMERIC,
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    info: DataTypes.STRING,
    area: DataTypes.INTEGER,
    hashed_password: DataTypes.STRING,
  }, {});
  passportLocalSequelize.attachToUser(users, {
    usernameField: 'username',
    hashField: 'hashed_password',
  });
  // users.plugin(passportLocalSequelize);
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

