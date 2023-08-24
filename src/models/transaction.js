'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }


  Transaction.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    senderId: {
     type:DataTypes.INTEGER,
     allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["deposit", "withdraw", "send"],
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM,
      values: ["Ksh", "USD", "EUR"],
      allowNull: false,
      defaultValue: "Ksh",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  
  return Transaction;
};