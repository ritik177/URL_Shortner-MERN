const { nanoid } = require('nanoid');
const UAParser = require('ua-parser-js');
const Url = require('../models/Url');
const moment = require('moment');

// Create short URL
exports.createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customCode, tags, expiryHours } = req.body;

    // Generate short code
    const shortCode = customCode || nanoid(8);

    // Check if custom code already exists
    if (customCode) {
      const existingUrl = await Url.findOne({ shortCode: customCode });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          error: 'Custom code already in use'
        });
      }
    }

    // Calculate expiry date if provided
    const expiryDate = expiryHours ? moment().add(expiryHours, 'hours').toDate() : null;

    const url = await Url.create({
      originalUrl,
      shortCode,
      tags,
      expiryDate
    });

    res.status(201).json({
      success: true,
      data: {
        shortUrl: `${process.env.BASE_URL}/${shortCode}`,
        originalUrl: url.originalUrl,
        expiryDate: url.expiryDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Redirect to original URL
exports.redirectToUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Check if URL has expired
    if (url.expiryDate && moment().isAfter(url.expiryDate)) {
      return res.status(410).json({
        success: false,
        error: 'URL has expired'
      });
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const deviceType = parser.getDevice().type || 'desktop';

    // Update analytics
    const visit = {
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || 'direct',
      deviceType
    };

    // Update device type count
    url.analytics.deviceTypes[deviceType] = (url.analytics.deviceTypes[deviceType] || 0) + 1;

    // Update referrer count
    const referrerIndex = url.analytics.referrers.findIndex(r => r.source === visit.referrer);
    if (referrerIndex > -1) {
      url.analytics.referrers[referrerIndex].count++;
    } else {
      url.analytics.referrers.push({ source: visit.referrer, count: 1 });
    }

    // Update total visits
    url.analytics.totalVisits++;
    url.analytics.visits.push(visit);

    // Calculate unique visitors (simple implementation using IP + User Agent)
    const visitorHash = `${req.ip}-${req.headers['user-agent']}`;
    const isUniqueVisitor = !url.analytics.visits.some(v => 
      `${v.ip}-${v.userAgent}` === visitorHash
    );
    if (isUniqueVisitor) {
      url.analytics.uniqueVisitors++;
    }

    await url.save();

    res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

// Get analytics for a short URL
exports.getAnalytics = async (req, res, next) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Get top 5 referrers
    const topReferrers = [...url.analytics.referrers]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get time series data (visits per day)
    const visitsByDay = url.analytics.visits.reduce((acc, visit) => {
      const day = moment(visit.timestamp).format('YYYY-MM-DD');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        totalVisits: url.analytics.totalVisits,
        uniqueVisitors: url.analytics.uniqueVisitors,
        deviceTypes: url.analytics.deviceTypes,
        topReferrers,
        visitsByDay,
        tags: url.tags,
        createdAt: url.createdAt,
        expiryDate: url.expiryDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get URLs by tag
exports.getUrlsByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const urls = await Url.find({ tags: tag });

    const urlsWithBasicAnalytics = urls.map(url => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalVisits: url.analytics.totalVisits,
      uniqueVisitors: url.analytics.uniqueVisitors,
      createdAt: url.createdAt,
      expiryDate: url.expiryDate
    }));

    res.json({
      success: true,
      data: urlsWithBasicAnalytics
    });
  } catch (error) {
    next(error);
  }
};

// Get all URLs
exports.getAllUrls = async (req, res, next) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    const urlsWithBasicAnalytics = urls.map(url => ({
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      tags: url.tags || [],
      analytics: {
        totalVisits: url.analytics.totalVisits,
        uniqueVisitors: url.analytics.uniqueVisitors,
        deviceTypes: url.analytics.deviceTypes,
        topReferrers: url.analytics.referrers
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        visitsByDay: url.analytics.visits.reduce((acc, visit) => {
          const day = moment(visit.timestamp).format('YYYY-MM-DD');
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {})
      },
      createdAt: url.createdAt,
      expiryDate: url.expiryDate
    }));

    res.json({
      success: true,
      data: urlsWithBasicAnalytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports; 