const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  type: { type: String, enum: ["money", "item"] },
  amount: Number,
  itemType: String,
  quantity: Number,
  pickupAddress: String,
  phone: String,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);
