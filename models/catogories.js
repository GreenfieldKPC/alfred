'use strict';
module.exports = (sequelize, DataTypes) => {
  const Catogories = sequelize.define('Catogories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING
  }, {});
  Catogories.associate = function(models) {
    // associations can be defined here
  };
  return Catogories;
};