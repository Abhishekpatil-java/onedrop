const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const sendThankYouEmail = require("../utils/sendMail");


// =========================
// RENDER DONATION CHOICE
// =========================
const renderDonateChoice = async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId);
  res.render("donations/donate_choice", { campaign });
};


// =========================
// RENDER MONEY PAGE
// =========================
const renderDonateMoney = async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId);
  res.render("donations/donate_money", { campaign });
};


// =========================
// RENDER ITEMS PAGE
// =========================
const renderDonateItems = async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId);
  res.render("donations/donate_items", { campaign });
};


// =========================
// POST MONEY DONATION
// =========================
const donateMoneyToCampaign = async (req, res) => {
  const { amount } = req.body;

  const campaign = await Campaign.findById(req.params.campaignId).populate(
    "creator",
    "name email"
  );

  if (!campaign) return res.status(404).send("Campaign not found");

  // update raised amount
  campaign.raisedAmount += Number(amount);
  await campaign.save();

  const donation = await Donation.create({
    user: req.session.user._id,
    campaign: campaign._id,
    type: "money",
    amount
  });

  // =========================
  // 📧 SEND EMAIL (MONEY)
  // =========================
  const donor = await User.findById(req.session.user._id);

  if (donor && donor.email) {
    await sendThankYouEmail(
      donor.email,           // to user
      donor.name,            // donor name
      campaign.title,        // campaign name
      amount                 // donated amount
    );
  }

  res.redirect("/api/campaigns");
};


// =========================
// POST ITEM DONATION
// =========================
const donateItemsToCampaign = async (req, res) => {
  const { itemType, quantity, pickupAddress, phone } = req.body;

  const campaign = await Campaign.findById(req.params.campaignId);

  const donation = await Donation.create({
    user: req.session.user._id,
    campaign: req.params.campaignId,
    type: "item",
    itemType,
    quantity,
    pickupAddress,
    phone,
    status: "pending pickup"
  });

  // =========================
  // 📧 SEND EMAIL (ITEM / CLOTHES)
  // =========================
  const donor = await User.findById(req.session.user._id);

  if (donor && donor.email) {
    await sendThankYouEmail(
      donor.email,              // to user
      donor.name,               // donor name
      campaign.title,           // campaign name
      "items / clothes"         // donation type
    );
  }

  res.redirect("/api/campaigns");
};


// =========================
// STATS
// =========================
const getDonationStats = async (req, res) => {
  const campaignId = req.params.campaignId;

  const donations = await Donation.find({ campaign: campaignId });

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalDonors = donations.length;
  const averageDonation =
    totalDonors > 0 ? (totalAmount / totalDonors).toFixed(2) : 0;

  res.render("donations/stats", {
    totalAmount,
    totalDonors,
    averageDonation
  });
};


module.exports = {
  renderDonateChoice,
  renderDonateMoney,
  renderDonateItems,
  donateMoneyToCampaign,
  donateItemsToCampaign,
  getDonationStats
};
