'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('Messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: DataTypes.STRING,
    from: DataTypes.INTEGER,
    to: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
    created: DataTypes.BOOLEAN,
  }, {});
  messages.associate = function(models) {
    // associations can be defined here
  };
  return messages;
};