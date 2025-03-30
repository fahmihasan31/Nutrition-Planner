'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menus extends Model {
    static associate(models) {
      menus.hasMany(models.plan_menus, { foreignKey: 'menu_id', as: 'plan_menus' });
    }
  }

  menus.init(
    {
      menu_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name_menu: DataTypes.STRING,
      category: DataTypes.ENUM('food', 'drink'),
      protein: DataTypes.FLOAT,
      carbs: DataTypes.FLOAT,
      calories: DataTypes.FLOAT,
      description: DataTypes.STRING,
      picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'menus',
    }
  );

  return menus;
};