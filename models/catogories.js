'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Catogories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING
  }, {});
  categories.associate = function(models) {
    // associations can be defined here
  };
  return categories;
};