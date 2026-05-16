const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  foodWasteReduced: {
    type: Number,
    default: 0
  },
  farmerIncomeIncrease: {
    type: Number,
    default: 0
  },
  transactionsCount: {
    type: Number,
    default: 0
  },
  co2Saved: {
    type: Number,
    default: 0
  },
  farmersActive: {
    type: Number,
    default: 0
  },
  region: {
    type: String,
    default: 'All India'
  },
  cropDemand: [{
    crop: String,
    demand: Number,
    supply: Number,
    price: Number
  }],
  wasteByCategory: [{
    category: String,
    wasteTons: Number,
    savedTons: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
