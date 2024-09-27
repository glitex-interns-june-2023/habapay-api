"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: Sequelize.UUID,
      },
      senderId: {
        type: Sequelize.INTEGER,
      },
      receiverId: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      senderNewBal: {
        type: Sequelize.FLOAT,
      },
      receiverNewBal: {
        type: Sequelize.FLOAT,
      },
      checked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      checkoutRequestId: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      status :{
        type: Sequelize.ENUM,
        values: ["pending", "approved", "declined"],
      },
      currency: {
        type: Sequelize.ENUM,
        values: ["Ksh", "USD", "EUR"],
        defaultValue: "Ksh",
      },
      timestamp: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
