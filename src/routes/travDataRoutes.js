const express = require('express');
const { getTravData } = require('../controllers/travDataController');

const router = express.Router();

router.get('/', getTravData);

module.exports = router;
