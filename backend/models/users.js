'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.hasMany(models.plans, { foreignKey: 'user_id', as: 'plans' });
    }
  }

  users.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.ENUM('male', 'female'),
      weight: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      activity_level: DataTypes.ENUM('low', 'medium', 'high'),
      goal: DataTypes.ENUM('lose_weight', 'maintain_weight', 'gain_weight'),
    },
    {
      sequelize,
      modelName: 'users',
    }
  );

  return users;
};