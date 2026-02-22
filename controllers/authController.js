const User = require("../models/User");
const validNgo = require("../models/validNgo");
const extractTextFromImage = require("../utils/ocr");
const bcrypt = require("bcryptjs");


// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let isNgoVerified = false;
    let certificatePath = null;

    // NGO OCR verification
    if (role === "ngo") {
      if (!req.file) {
        return res.status(400).send("NGO certificate required");
      }

      const text = await extractTextFromImage(req.file.path);
      console.log("OCR TEXT:\n", text);

     const regMatch = text.match(/\b\d{2,5}[\/-]\d{4}-\d{2}\b/);


      if (!regMatch) {
        return res.status(400).send("Could not detect registration number");
      }

      const extractedRegNo = regMatch[0];
      console.log("Extracted Registration Number:", extractedRegNo);

      const foundNgo = await validNgo.findOne({
        registrationNumber: extractedRegNo
      });

      if (!foundNgo) {
        return res.status(400).send("Invalid NGO certificate");
      }

      isNgoVerified = true;
      certificatePath = req.file.path;
    }

    await User.create({
      name,
      email,
      password, // hashed by schema
      role,
      ngoCertificate: certificatePath,
      isNgoVerified
    });

    res.redirect("/api/auth/login");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect("/");
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};



// LOGOUT
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed");
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};



// RENDER FORMS--> login
const renderLoginForm = (req, res) => {
  res.render("users/login");
};

// signup
const renderSignupForm = (req, res) => {
  res.render("users/signup");
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  renderLoginForm,
  renderSignupForm
};
