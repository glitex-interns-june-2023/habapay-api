'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      googleId : {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      profileUrl: {
        type: Sequelize.STRING
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('superadmin', 'admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};