'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class plans extends Model {
    static associate(models) {
      plans.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
      plans.hasMany(models.plan_menus, { foreignKey: 'plan_id', as: 'plan_menus', onDelete: 'CASCADE', });
    }
  }

  plans.init(
    {
      plan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      plan_start: DataTypes.DATE,
      plan_end: DataTypes.DATE,
      status: DataTypes.ENUM('draft', 'ongoing', 'completed', 'cancelled'),
    },
    {
      sequelize,
      modelName: 'plans',
    }
  );

  return plans;
};