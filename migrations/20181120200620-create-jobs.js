'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      poster: {
        type: Sequelize.INTEGER
      },
      doer: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.NUMERIC
      },
      payment: {
        type: Sequelize.INTEGER
      },
       id_area: {
         type: Sequelize.INTEGER
       },

      address: {
        type: Sequelize.STRING
      },
       zip: {
         type: Sequelize.INTEGER
       },
        lat: {
          type: Sequelize.STRING
        }, address: {
        type: Sequelize.STRING
      },
       lon: {
         type: Sequelize.STRING
       },
      completed: {
        type: Sequelize.BOOLEAN
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('jobs');
  }
};