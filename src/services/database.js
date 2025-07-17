// src/services/database.js
const mongoose = require('mongoose');
const { mongoUri } = require('../config');
const Email = require('../models/email');

async function connectToMongo() {
  console.log('Attempting to connect with MONGO_URI:', mongoUri);
  if (!mongoUri) {
    console.error('Error: MONGO_URI is undefined in config');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri); // Remove deprecated options
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function saveEmails(emails, url) {
  try {
    const emailDocs = emails.map(email => ({ email, sourceUrl: url, scrapedAt: new Date() }));
    await Email.insertMany(emailDocs, { ordered: false });
    console.log(`Saved ${emails.length} emails from ${url} to MongoDB`);
  } catch (error) {
    console.error('Error saving to MongoDB:', error.message);
  }
}

async function getEmailsByUrl(url) {
  try {
    return await Email.find({ sourceUrl: url }).exec();
  } catch (error) {
    console.error('Error fetching emails by URL:', error.message);
    return [];
  }
}

async function getAllEmails() {
  try {
    return await Email.find({}).exec();
  } catch (error) {
    console.error('Error fetching all emails:', error.message);
    return [];
  }
}

module.exports = { connectToMongo, saveEmails, getEmailsByUrl, getAllEmails };