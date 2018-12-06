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
        type: Sequelize.NUMERIC
      },
      email: {
        type: Sequelize.STRING
      },
       id_stripe_customer: {
         type: Sequelize.STRING
       },
        id_stripe_account: {
          type: Sequelize.STRING
        },
      picture: {
        type: Sequelize.STRING
      },
      id_area: {
        type: Sequelize.INTEGER
      },
       hashed_password: {
         type: Sequelize.STRING
       },
       id_category: {
         type: Sequelize.INTEGER
       },
         is_employee: {
         type: Sequelize.BOOLEAN
       },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};