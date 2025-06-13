const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { validateUrl } = require('../middleware/validators');

// Get all URLs
router.get('/', urlController.getAllUrls);

// Create short URL
router.post('/', validateUrl, urlController.createShortUrl);

// Get URLs by tag
router.get('/tags/:tag', urlController.getUrlsByTag);


// Get analytics for a short URL
router.get('/:code/analytics', urlController.getAnalytics);

// Redirect to original URL
// router.get('/:code', urlController.redirectToUrl);

module.exports = router; 