"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Analytics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Analytics.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }
  Analytics.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      appLaunches: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Analytics",
    }
  );
  return Analytics;
};
