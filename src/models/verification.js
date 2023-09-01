"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Verification.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Verification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["pin", "email"],
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiryTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Verification",
    }
  );
  return Verification;
};
