const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const protect = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };



const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    // save where user wanted to go
    req.session.redirectTo = req.originalUrl;

    // if using flash
    // req.flash("error", "Please login first");

    return res.redirect("/api/auth/login");
  }
  next();
};

const isNgo = (req, res, next) => {
  if (req.session.user.role !== "ngo") {
    return res.status(403).send("Only NGOs can create campaigns");
  }
  next();
};


const isUser = (req, res, next) => {
  if (req.session.user.role !== "user") {
    return res.status(403).send("Only users can view campaigns");
  }
  next();
};



module.exports = { isLoggedIn,isNgo,isUser};
