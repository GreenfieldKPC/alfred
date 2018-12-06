'use strict';
module.exports = (sequelize, DataTypes) => {
  const complaint = sequelize.define('complaint', {
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    category: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    resolved: DataTypes.BOOLEAN
  }, {});
  complaint.associate = function (models) {
    // associations can be defined here
  };
  return complaint;
};
