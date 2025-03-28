'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class plans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      plans.belongsTo(models.users, { foreignKey: 'user_id', as: 'users' });
    }
  }
  plans.init({
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    plan_start: DataTypes.DATE,
    plan_end: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'plans',
  });
  return plans;
};