'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username:{ type: 
        Sequelize.STRING
      },
      name_first:{
        type: Sequelize.STRING,
      },
      name_last: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.STRING
      },
      area: {
        type: Sequelize.INTEGER
      },
      hashed_password: {
        type: Sequelize.STRING,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};