// routes/user_route.js
const express = require('express');
const router = express.Router();
const { createMenu, getAllMenuCategory, getMenuByKey, getMenuById, getFoodImage, updateMenu, deleteMenu } = require('../controller/menu_controller');

// Routes
router.post("/", createMenu);
router.get("/", getAllMenuCategory);
router.get("/image/:filename", getFoodImage)
router.get("/:id", getMenuById);
router.get("/search/:key", getMenuByKey);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

module.exports = router;