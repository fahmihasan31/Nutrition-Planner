'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food_recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      food_recommendation.belongsTo(models.users, {
        foreignKey: 'user_id',
        as: 'users'
      });

      food_recommendation.belongsTo(models.menus, {
        foreignKey: 'menu_id',
        as: 'menus'
      });
    }
  }
  food_recommendation.init({
    food_recommendation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    recommended_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'food_recommendation',
  });
  return food_recommendation;
};