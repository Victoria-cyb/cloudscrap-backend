const mongoose = require('mongoose');
const { createObjectCsvStringifier } = require('csv-writer');
const Email = require('../models/email');

async function connectToMongo() {
  const mongoUri = process.env.MONGO_URI;
  console.log('Attempting to connect with MONGO_URI:', mongoUri);
  if (!mongoUri) {
    console.error('Error: MONGO_URI is undefined in config');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function saveEmails(emails, url, userId) {
  try {
    const emailDocs = emails.map(email => ({
      email,
      sourceUrl: url,
      scrapedAt: new Date(),
      userId,
    }));
    await Email.insertMany(emailDocs, { ordered: false });
    console.log(`Saved ${emails.length} emails from ${url} to MongoDB for user ${userId}`);
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

async function getUserEmails(userId) {
  try {
    return await Email.find({ userId }).lean();
  } catch (error) {
    console.error('Error fetching user emails:', error.message);
    return [];
  }
}

async function generateCSV(userId) {
  try {
    const emails = await getUserEmails(userId);
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'email', title: 'Email' },
        { id: 'sourceUrl', title: 'Source URL' },
        { id: 'scrapedAt', title: 'Date Collected' },
      ],
    });
    return csvStringifier.stringifyRecords(emails);
  } catch (error) {
    console.error('Error generating CSV:', error.message);
    throw error;
  }
}

module.exports = { connectToMongo, saveEmails, getEmailsByUrl, getAllEmails, getUserEmails, generateCSV };