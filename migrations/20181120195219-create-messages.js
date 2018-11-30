'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      id_from: {
        type: Sequelize.INTEGER
      },
      id_to: {
        type: Sequelize.STRING
      },
      read: {
        type: Sequelize.BOOLEAN
      },
     created: {
       type: Sequelize.NUMERIC
     }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('messages');
  }
};