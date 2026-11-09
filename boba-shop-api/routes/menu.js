const express = require('express');
const router = express.Router();
const menuController = require('../src/controller/menuController');

router.get('/', menuController.getPublicMenu);

module.exports = router;
