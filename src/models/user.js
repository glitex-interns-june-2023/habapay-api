"use strict";
const { Model, useInflection } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasOne(models.Wallet, {
        foreignKey: "userId",
        as: "wallet",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Transaction, {
        foreignKey: "userId",
        as: "transactions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasOne(models.Business, {
        foreignKey: "userId",
        as: "business",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Verification, {
        foreignKey: "userId",
        as: "verifications",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Log, {
        foreignKey: "userId",
        as: "activity",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      User.hasMany(models.Analytic, {
        foreignKey: "userId",
        as: "analytics",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    toJSON() {
      const { password, googleId, loginPin, ...rest } = this;
      return rest;
    }
  }

  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      googleId: DataTypes.STRING,
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: DataTypes.STRING,
      phone: DataTypes.STRING,
      secondaryPhone: DataTypes.STRING,
      profileUrl: DataTypes.STRING,
      password: DataTypes.STRING,
      location: {
        type: DataTypes.STRING,
        defaultValue: "Nairobi, Kenya",
      },
      role: {
        type: DataTypes.ENUM("superadmin", "admin", "user"),
        defaultValue: "user",
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      loginPin: {
        type: DataTypes.STRING,
      },
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
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["password", "googleId", "loginPin"],
        },
      },
    }
  );

  // User Scopes
  User.addScope("admin", {
    where: {
      role: "admin",
    },
  });

  User.addScope("superadmin", {
    where: {
      role: "superadmin",
    },
  });

  User.addScope("user", {
    where: {
      role: "user",
    },
  });

  return User;
};
