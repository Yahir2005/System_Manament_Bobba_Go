const express = require('express');
const router = express.Router();
const rewardsController = require('../src/controller/rewardsController');

router.get('/eligible-products', rewardsController.getEligibleRewardProducts);
router.post('/claim', rewardsController.claimReward);

module.exports = router;
