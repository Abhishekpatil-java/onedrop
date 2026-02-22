const express = require('express');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload.js");
const router = express.Router();
const { 
    registerUser, 
    loginUser ,
    renderLoginForm,
    renderSignupForm,
    logoutUser
} = require('../controllers/authController');



// ----
router.get('/login',renderLoginForm);
router.get('/signup',renderSignupForm)

// ----

router.post("/signup", upload.single("ngoCertificate"), registerUser);


router.post('/login', loginUser);


// logout --> post
router.post('/logout', isLoggedIn,logoutUser);

module.exports = router;
