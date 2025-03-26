const express = require('express');
const router = express.Router();
const { Login } = require('../controller/auth_controller');

// POST /api/login
router.post('/', Login);

module.exports = router;