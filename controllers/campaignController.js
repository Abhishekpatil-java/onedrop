const Campaign = require("../models/Campaign");

// CREATE
const createCampaign = async (req, res) => {
  const { title, description, targetAmount, deadline, imageUrl, category } = req.body;

  await Campaign.create({
    title,
    description,
    targetAmount,
    deadline,
    imageUrl,
    category,
    creator: req.session.user._id
  });

  res.redirect("/api/campaigns");
};

// GET ALL + AUTO STATUS UPDATE
const getAllCampaigns = async (req, res) => {
  let campaigns = await Campaign.find()
    .populate("creator", "name role")
    .sort({ createdAt: -1 });

  const now = new Date();

  for (let c of campaigns) {
    if (c.raisedAmount >= c.targetAmount && c.status !== "completed") {
      c.status = "completed";
      await c.save();
    } 
    else if (new Date(c.deadline) < now && c.status === "active") {
      c.status = "expired";
      await c.save();
    }
  }

  campaigns = await Campaign.find().populate("creator", "name role");

  res.render("show", { campaigns, user: req.session.user });
};

// GET BY ID
const getCampaignById = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("creator", "name");

  res.render("detail_view", { campaign, user: req.session.user });
};

// RENDER UPDATE PAGE
const renderUpdateCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) return res.send("Not found");

  if (
    campaign.creator.toString() !== req.session.user._id.toString() ||
    req.session.user.role !== "ngo"
  ) return res.send("Unauthorized");

  if (campaign.status !== "active")
    return res.send("Campaign already expired/completed");

  res.render("update", { campaign });
};

// UPDATE
const updateCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (
    campaign.creator.toString() !== req.session.user._id.toString() ||
    req.session.user.role !== "ngo"
  ) return res.send("Unauthorized");

  if (campaign.status !== "active")
    return res.send("Cannot update completed/expired campaign");

  Object.assign(campaign, req.body);
  await campaign.save();

  res.redirect("/api/campaigns");
};

// DELETE (ONLY MANUAL BY NGO, NOT AUTO)
const deleteCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (
    campaign.creator.toString() !== req.session.user._id.toString() ||
    req.session.user.role !== "ngo"
  ) return res.send("Unauthorized");

  await Campaign.findByIdAndDelete(req.params.id);

  res.redirect("/api/campaigns");
};


// get --->  renderCreateCampaign
const renderCreateCampaign = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/api/auth/login"); // safety
  }

  res.render("new", {
    userId: req.session.user._id
  });
};

// 





module.exports = {
    createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign,
    renderCreateCampaign,renderUpdateCampaign
};


