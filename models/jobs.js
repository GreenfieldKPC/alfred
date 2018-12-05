'use strict';
module.exports = (sequelize, DataTypes) => {
  const jobs = sequelize.define('Jobs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    poster: DataTypes.INTEGER,
    doer: DataTypes.INTEGER,
    category: DataTypes.INTEGER,
    description: DataTypes.STRING,
    created_at: DataTypes.NUMERIC,
    payment: DataTypes.INTEGER,
    id_area: DataTypes.INTEGER,
    address: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING,
    completed: DataTypes.BOOLEAN
  }, {});
  jobs.associate = function (models) {
    // associations can be defined here
  };
  return jobs;
};
