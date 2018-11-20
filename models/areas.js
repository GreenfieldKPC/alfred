'use strict';
module.exports = (sequelize, DataTypes) => {
  const Areas = sequelize.define('Areas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: DataTypes.STRING
  }, {});
  Areas.associate = function(models) {
    // associations can be defined here
  };
  return Areas;
};