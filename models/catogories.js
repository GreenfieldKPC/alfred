'use strict';
module.exports = (sequelize, DataTypes) => {
  const catogories = sequelize.define('Catogories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING
  }, {});
  catogories.associate = function(models) {
    // associations can be defined here
  };
  return catogories;
};