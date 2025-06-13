const express = require('express');
const router = express.Router();
const urlRoutes = require('./urlRoutes');

router.use('/urls', urlRoutes);

module.exports = router; 