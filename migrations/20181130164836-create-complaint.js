'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('complaints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
       address: {
         type: Sequelize.STRING
       },
       category: {
         type: Sequelize.INTEGER
       },
      id_user: {
        type: Sequelize.INTEGER
      }, 
      photo: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
  resolved: {
    type: Sequelize.BOOLEAN
  },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('complaints');
  }
};