'use strict';
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: DataTypes.STRING,
    from: DataTypes.INTEGER,
    to: DataTypes.STRING
  }, {});
  Messages.associate = function(models) {
    // associations can be defined here
  };
  return Messages;
};