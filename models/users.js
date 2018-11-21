'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
       primaryKey: true,
         autoIncrement: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name_first: DataTypes.STRING,
    name_last: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    info: DataTypes.STRING,
    area: DataTypes.INTEGER
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

