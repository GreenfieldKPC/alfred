'use strict';
module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: DataTypes.INTEGER,
    job: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    from: DataTypes.INTEGER
  }, {});
  rating.associate = function(models) {
    // associations can be defined here
  };
  return rating;
};