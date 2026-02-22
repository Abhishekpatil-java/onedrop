const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const ValidNgo = require("./models/validNgo");
const methodOverride = require("method-override");





dotenv.config();
connectDB();

const app = express();   // ✅ DEFINE APP FIRST
app.use(methodOverride("_method"));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ===== SESSION CONFIG =====
const sessionOption={
    secret:"12345678",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOption));



// ==== SET EJS ENGINE (FIXES YOUR ERROR) ====


// 



// ===== SET EJS ENGINE (FIXES YOUR ERROR) =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== ROUTES =====
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const donationRoutes = require('./routes/donationRoutes');
const sendThankYouEmail = require("./utils/sendMail");


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", process.env.EMAIL_PASS ? "YES" : "NO");



// ===== TEST ROUTE (IMPORTANT) =====
app.get("/", (req, res) => {
  res.render("index", { user: req.session.user || null });
});


app.get("/test-mail", async (req, res) => {
  await sendThankYouEmail(
    "abhishekpatil1664@gmail.com",
    "Test",
    "Test Campaign",
    100
  );
  res.send("Mail sent");
});


// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// this method for inseting dummy data into ngo data base

// app.get("/test-ngo", async (req,res)=>{
//   await ValidNgo.create({
//     ngoName: "Test NGO",
//     registrationNumber: "12345-TEST"
//   });
//   res.send("NGO inserted");
// });
