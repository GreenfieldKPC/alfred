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
       category: {
         type: Sequelize.STRING
       },
      id_user: {
        type: Sequelize.INTEGER
      }, 
       id_job: {
         type: Sequelize.INTEGER
       },
       created_at: {
         type: Sequelize.NUMERIC
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