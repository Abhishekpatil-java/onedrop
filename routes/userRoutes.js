const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/',isLoggedIn, getUserProfile);

module.exports = router;
