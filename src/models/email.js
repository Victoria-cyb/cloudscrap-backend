const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  sourceUrl: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Email', emailSchema);