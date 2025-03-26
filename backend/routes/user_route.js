// routes/user_route.js
const express = require('express');
const router = express.Router();
const { getAllUser, getUserById, getUserbyKey, createUser, updateUser, deleteUser, updatePassword } = require('../controller/user_controller');

// Routes
router.post("/", createUser);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.get("/search/:key", getUserbyKey);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/password/:id", updatePassword);

module.exports = router;