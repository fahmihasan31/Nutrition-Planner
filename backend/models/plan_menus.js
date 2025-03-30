'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class plan_menus extends Model {
    static associate(models) {
      plan_menus.belongsTo(models.plans, {
        foreignKey: 'plan_id',
        as: 'plan',
        onDelete: 'CASCADE',
      });
      plan_menus.belongsTo(models.menus, { foreignKey: 'menu_id', as: 'menu' });

    }
  }

  plan_menus.init(
    {
      plan_menu_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      plan_id: DataTypes.INTEGER,
      menu_id: DataTypes.INTEGER,
      meal_time: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
    },
    {
      sequelize,
      modelName: 'plan_menus',
    }
  );

  return plan_menus;
};