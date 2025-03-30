'use strict';
const userModel = require('../models/index').users;
const plan_menuModel = require('../models/index').plan_menus;
const menusModel = require('../models/index').menus;
const plansModel = require('../models/index').plans;

module.exports = {
  // Get all plans with related data
  async getAllPlans(req, res) {
    try {
      const allPlans = await plansModel.findAll({
        include: [
          "user",
          {
            model: plan_menuModel,
            as: 'plan_menus',
            include: [
              { model: menusModel, as: 'menu', attributes: ['menu_id', 'name_menu', 'category', 'protein', 'carbs', 'calories', 'description', 'picture'] }
            ],
          },
        ],
        order: [["plan_id", "DESC"]],
      });

      if (!allPlans || allPlans.length === 0) {
        return res.status(404).json({ status: false, message: 'No plans found', data: [] });
      }

      return res.status(200).json({
        status: true,
        message: 'All plans retrieved successfully',
        data: allPlans,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error retrieving plans', error: error.message });
    }
  },

  // Get plan by ID with related data
  async getPlanById(req, res) {
    try {
      const plan = await plansModel.findByPk(req.params.id, {
        include: [
          { model: userModel, as: 'user' },
          {
            model: plan_menuModel,
            as: 'plan_menus',
            include: [{ model: menusModel, as: 'menu' }],
          },
        ],
      });
      if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });
      return res.status(200).json({
        status: true,
        message: 'Plan retrieved successfully',
        data: plan,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error retrieving plan', error: error.message });
    }
  },

  // Create new plan with plan_menus
  async createPlan(req, res) {
    try {
      const { user_id, name, plan_start, plan_end, status, menu_items } = req.body;

      if (!user_id || !name || !plan_start || !plan_end || !status || !menu_items || menu_items.length === 0) {
        return res.status(400).json({ status: false, message: 'All fields are required including menu_items' });
      }

      // Validate menu items
      for (const menu of menu_items) {
        const menuExists = await menusModel.findByPk(menu.menu_id);
        if (!menuExists) {
          return res.status(400).json({ status: false, message: `Menu with ID ${menu.menu_id} does not exist` });
        }
      }

      // Create the plan first
      const newPlan = await plansModel.create({ user_id, name, plan_start, plan_end, status });

      // Create associated plan_menus
      const planMenuEntries = menu_items.map((menu) => ({
        plan_id: newPlan.plan_id,
        menu_id: menu.menu_id,
        meal_time: menu.meal_time,
      }));
      await plan_menuModel.bulkCreate(planMenuEntries);

      const createdPlan = await plansModel.findByPk(newPlan.plan_id, {
        include: [{ model: plan_menuModel, as: 'plan_menus', include: [{ model: menusModel, as: 'menu' }] }],
      });

      return res.status(201).json({
        status: true,
        message: 'Plan created successfully',
        data: createdPlan,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error creating plan', error: error.message });
    }
  },

  // Update plan with plan_menus
  async updatePlan(req, res) {
    try {
      const { name, plan_start, plan_end, status, menu_items } = req.body;
      const plan = await plansModel.findByPk(req.params.id, {
        include: [{ model: plan_menuModel, as: 'plan_menus' }],
      });

      if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });

      // Validate menu items
      if (menu_items && menu_items.length > 0) {
        for (const menu of menu_items) {
          const menuExists = await menusModel.findByPk(menu.menu_id);
          if (!menuExists) {
            return res.status(400).json({ status: false, message: `Menu with ID ${menu.menu_id} does not exist` });
          }
        }
      }

      // Update plan details
      await plan.update({ name, plan_start, plan_end, status });

      // Delete existing plan_menus
      await plan_menuModel.destroy({ where: { plan_id: plan.plan_id } });

      // Add updated plan_menus
      if (menu_items && menu_items.length > 0) {
        const planMenuEntries = menu_items.map((menu) => ({
          plan_id: plan.plan_id,
          menu_id: menu.menu_id,
          meal_time: menu.meal_time,
        }));
        await plan_menuModel.bulkCreate(planMenuEntries);
      }

      const updatedPlan = await plansModel.findByPk(plan.plan_id, {
        include: [{ model: plan_menuModel, as: 'plan_menus', include: [{ model: menusModel, as: 'menu' }] }],
      });

      return res.status(200).json({
        status: true,
        message: 'Plan updated successfully',
        data: updatedPlan,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error updating plan', error: error.message });
    }
  },

  // Delete plan
  async deletePlan(req, res) {
    try {
      const plan = await plansModel.findByPk(req.params.id);
      if (!plan) return res.status(404).json({ status: false, message: 'Plan not found' });
      await plan.destroy();
      return res.status(200).json({ status: true, message: 'Plan deleted successfully' });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error deleting plan', error: error.message });
    }
  },
};