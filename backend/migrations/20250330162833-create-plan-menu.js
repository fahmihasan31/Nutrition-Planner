module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plan_menus', {
      plan_menu_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'plan_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'menus',
          key: 'menu_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meal_time: {
        type: Sequelize.ENUM('breakfast', 'lunch', 'dinner'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('plan_menus');
  }
};
