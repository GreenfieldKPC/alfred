'use strict';

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
    id_area: DataTypes.INTEGER,
    hashed_password: DataTypes.STRING
  }, {});
  
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

