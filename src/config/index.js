// src/config/index.js
require('dotenv').config();

const config = {
  scrapingBeeApiKey: process.env.SCRAPINGBEE_API_KEY,
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 4000,
  redditScraperUrl: process.env.REDDIT_SCRAPER_URL,
};

// Debug environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('REDDIT_SCRAPER_URL:', process.env.REDDIT_SCRAPER_URL);
console.log('Config:', config); // Add this to confirm the config object

// Validate required variables
if (!config.scrapingBeeApiKey) throw new Error('SCRAPINGBEE_API_KEY is required in .env');
if (!config.mongoUri) throw new Error('MONGO_URI is required in .env');
if (!config.redditScraperUrl) throw new Error('REDDIT_SCRAPER_URL is required in .env');

module.exports = config;