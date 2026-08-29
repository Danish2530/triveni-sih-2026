const express = require('express');
const router = express.Router();
const { getGovernmentDashboardData } = require('../controllers/governmentController');

router.get('/government', getGovernmentDashboardData);

module.exports = router;
