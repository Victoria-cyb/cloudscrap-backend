// src/services/redditScraper.js
const axios = require('axios');
const { redditScraperUrl } = require('../config');


async function fetchRedditEmails() {
  try {
    const req = await fetch(`${redditScraperUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
  
const res = await req.json();
  console.log(`Fetched emails from Reddit scraper at ${res}`);
   
    if (!res || !res || !Array.isArray(res)) {
      console.error('Invalid response structure from Reddit scraper');
      return [];
    }

    // const response = await axios.get("https://email-scrapper-1.onrender.com/scrape-emails?subreddit=FlutterDev&domain=gmail.com&only_known_domains=true");
    console.log(`Fetched emails from Reddit scraper at ${res}`);
    const emails = res || []; // Adjust based on your endpoint's response structure
    return [...new Set(emails)]; // Remove duplicates
  } catch (error) {
    console.error(`Error fetching Reddit emails: ${error.message}`);
    return [];
  }
}

module.exports = { fetchRedditEmails };