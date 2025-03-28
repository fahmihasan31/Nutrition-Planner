'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menus.init({
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_menu: DataTypes.STRING,
    category: DataTypes.ENUM('food', 'drink'),
    protein: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,
    calories: DataTypes.FLOAT,
    description: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'menus',
  });
  return menus;
};