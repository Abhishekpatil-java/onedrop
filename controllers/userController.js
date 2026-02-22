const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

const getUserProfile = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.redirect("/api/auth/login");
    }

    let campaigns = [];
    let donations = [];

    // ================= NGO PROFILE =================
    if (user.role === "ngo") {
      // campaigns created by NGO
      campaigns = await Campaign.find({ creator: user._id });

      // donations received for NGO campaigns
      donations = await Donation.find({
        campaign: { $in: campaigns.map(c => c._id) }
      })
        .populate("user", "name email")
        .populate("campaign", "title"); // ✅ populate campaign
    }

    // ================= USER PROFILE =================
    if (user.role === "user") {
      // donations made by user
      donations = await Donation.find({ user: user._id })
        .populate("campaign", "title"); // ✅ populate campaign
    }

    // ✅ FILTER donations with deleted campaigns (campaign = null)
    donations = donations.filter(d => d.campaign !== null);

    res.render("profile", {
      user,
      campaigns,
      donations
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = { getUserProfile };
