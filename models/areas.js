'use strict';
module.exports = (sequelize, DataTypes) => {
  const areas = sequelize.define('Areas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: DataTypes.STRING
  }, {});
  areas.associate = function(models) {
    // associations can be defined here
  };
  return areas;
};