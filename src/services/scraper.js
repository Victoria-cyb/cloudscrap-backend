const { ScrapingBeeClient } = require('scrapingbee');
const { scrapingBeeApiKey } = require('../config');

const client = new ScrapingBeeClient(process.env.SCRAPINGBEE_API_KEY);
const emailRegex = /[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|[a-zA-Z0-9.-]+\.(com|org|io|co\.uk|us))/gi;

async function scrapeEmails(url) {
  try {
    const response = await client.get({
      url,
      params: {
        render_js: true,
        premium_proxy: false,
        block_ads: true,
        block_resources: true,
      },
    });
    const decoder = new TextDecoder();
    const text = decoder.decode(response.data);
    const emails = text.match(emailRegex) || [];
    return [...new Set(emails)]; // Remove duplicates
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}

module.exports = { scrapeEmails };