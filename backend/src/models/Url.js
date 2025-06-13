const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  expiryDate: {
    type: Date
  },
  analytics: {
    totalVisits: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    deviceTypes: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    },
    referrers: [{
      source: String,
      count: Number
    }],
    visits: [{
      timestamp: Date,
      ip: String,
      userAgent: String,
      referrer: String,
      deviceType: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
urlSchema.index({ shortCode: 1 });
urlSchema.index({ tags: 1 });
urlSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Url', urlSchema); 