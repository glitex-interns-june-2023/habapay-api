"use strict";
const { Sequelize, Model } = require("sequelize");
const { formatTimestamp } = require("../utils");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Transaction.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Transaction.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    getFormattedTimestamp() {
      return formatTimestamp(this.timestamp);
    }
  }

  Transaction.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
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
      senderNewBal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      receiverNewBal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      checked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      checkoutRequestId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["deposit", "withdraw", "sent"],
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "declined"],
        allowNull: false,
        defaultValue: "pending",
      },
      currency: {
        type: DataTypes.ENUM,
        values: ["Ksh", "USD", "EUR"],
        allowNull: false,
        defaultValue: "Ksh",
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      timestamps: false,
    }
  );

  return Transaction;
};
