const express = require('express');
const router = express.Router();
const { isLoggedIn,isUser} = require('../middlewares/authMiddleware');
const {   
  renderDonateChoice,
  renderDonateMoney,
  renderDonateItems,
  donateMoneyToCampaign,
  donateItemsToCampaign,
  getDonationStats   } = require('../controllers/donationController');

// 

router.get("/:campaignId",  isLoggedIn,renderDonateChoice);

router.get("/:campaignId/money" ,isLoggedIn,renderDonateMoney);
router.get("/:campaignId/items" ,isLoggedIn,renderDonateItems);

router.post("/:campaignId/money", isLoggedIn,donateMoneyToCampaign);
router.post("/:campaignId/items", isLoggedIn,donateItemsToCampaign);

router.get("/stats/:campaignId",isLoggedIn,getDonationStats);

module.exports = router;


