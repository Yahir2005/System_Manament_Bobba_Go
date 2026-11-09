const express = require('express');
const router = express.Router();
const loyaltyController = require('../src/controller/loyaltyController');

router.get('/customers/:id', loyaltyController.getCustomerCard);
router.post('/scan', loyaltyController.scanQr);

module.exports = router;
