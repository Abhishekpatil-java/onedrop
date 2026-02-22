const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },

  deadline: { type: Date, required: true },
  imageUrl: { type: String },

  category: { 
    type: String, 
    enum: [
  'Clothes',
  'Money',
  'Medicine',
  'Food',
  'Education',
  'Footwear',
  'Stationery',
  'Shelter',
  'Gadgets',
  'Other'
]
  },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ✅ STATUS (important)
  status: {
    type: String,
    enum: ["active", "expired", "completed"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
