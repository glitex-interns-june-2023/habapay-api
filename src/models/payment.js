"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {}

  Payment.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      ref: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      purpose: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );

  return Payment;
};
