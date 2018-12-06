'use strict';
module.exports = (sequelize, DataTypes) => {
  const photos = sequelize.define('photos', {
    id_user: DataTypes.INTEGER,
    id_job: DataTypes.INTEGER,
    lat: DataTypes.NUMERIC,
    lon: DataTypes.NUMERIC,
    url: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {});
  photos.associate = function (models) {
    // associations can be defined here
  };
  return photos;
};
