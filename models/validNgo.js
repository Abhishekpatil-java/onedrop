const mongoose = require("mongoose");

const validNgoSchema = new mongoose.Schema({
  ngoName: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model("ValidNgo", validNgoSchema);
