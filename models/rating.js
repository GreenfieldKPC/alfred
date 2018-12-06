'use strict';
module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: DataTypes.INTEGER,
    id_job: DataTypes.INTEGER,
    id_to: DataTypes.INTEGER,
    id_from: DataTypes.INTEGER
  }, {});
  rating.associate = function (models) {
    // associations can be defined here
  };
  return rating;
};
