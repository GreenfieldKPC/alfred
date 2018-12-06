'use strict';
module.exports = (sequelize, DataTypes) => {
  const complaint = sequelize.define('complaint', {
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    id_job: DataTypes.INTEGER,
    resolved: DataTypes.BOOLEAN,

  }, {});
  complaint.associate = function (models) {
    // associations can be defined here
  };
  return complaint;
};
