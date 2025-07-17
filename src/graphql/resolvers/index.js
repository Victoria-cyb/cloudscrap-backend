// src/graphql/resolvers/index.js
const { scrapeEmails } = require('../../services/scraper');
const { fetchRedditEmails } = require('../../services/redditScrapper');
const { saveEmails, getEmailsByUrl, getAllEmails } = require('../../services/database');

const resolvers = {
  Query: {
    getEmails: async (_, { url }) => {
      const emails = await scrapeEmails(url);
      await saveEmails(emails, url);
      return emails.map(email => ({
        email,
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
      }));
    },
    getAllEmails: async () => {
      const emails = await getAllEmails();
      return emails.map(email => ({
        email: email.email,
        sourceUrl: email.sourceUrl,
        scrapedAt: email.scrapedAt.toISOString(),
      }));
    },
    getRedditEmails: async () => {
      const emails = await fetchRedditEmails();
      return emails.map(email => ({
        email,
        sourceUrl: 'Reddit', // Use a generic source since no specific URL is provided
        scrapedAt: new Date().toISOString(),
      }));
    },
  },
  Mutation: {
    scrapeAndSaveRedditEmails: async () => {
      try {
        const emails = await fetchRedditEmails();
        if (!emails.length) {
          return {
            success: false,
            message: 'No emails scraped from Reddit',
            emails: [],
          };
        }

        await saveEmails(emails, 'Reddit'); // Reuse existing saveEmails function
        const savedEmails = await getEmailsByUrl('Reddit');

        return {
          success: true,
          message: `Saved ${emails.length} emails from Reddit`,
          emails: savedEmails.map(email => ({
            email: email.email,
            sourceUrl: email.sourceUrl,
            scrapedAt: email.scrapedAt.toISOString(),
          })),
        };
      } catch (error) {
        console.error('Error in scrapeAndSaveRedditEmails:', error.message);
        return {
          success: false,
          message: `Failed to scrape and save Reddit emails: ${error.message}`,
          emails: [],
        };
      }
    },
  },
};

module.exports = resolvers;