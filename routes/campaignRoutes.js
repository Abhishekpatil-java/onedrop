const express = require('express');
const router = express.Router();
const { isLoggedIn,isNgo } = require('../middlewares/authMiddleware');
const {
    createCampaign, 
    getAllCampaigns, 
    getCampaignById, 
    updateCampaign, 
    deleteCampaign,
    renderCreateCampaign,
    renderUpdateCampaign} = require('../controllers/campaignController');
 


// create ---> campaging
router.get('/create',isLoggedIn,isNgo,renderCreateCampaign);
router.post('/create', isLoggedIn,isNgo,createCampaign);

// 
router.get('/:id',isLoggedIn, getCampaignById);
router.get('/', isLoggedIn,getAllCampaigns);


// 
router.get("/:id/edit",isLoggedIn,isNgo, renderUpdateCampaign);
router.put("/:id",isLoggedIn,isNgo, updateCampaign);

router.delete('/:id', isLoggedIn,isNgo, deleteCampaign);



module.exports = router;


