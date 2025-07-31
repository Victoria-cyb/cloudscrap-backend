const { scrapeEmails } = require('../../services/scraper');
const { fetchRedditEmails } = require('../../services/redditScrapper');
const { saveEmails, getEmailsByUrl, getAllEmails, getUserEmails, generateCSV } = require('../../services/database');
const userResolvers = require('./user');


const resolvers = {
  Query: {
    getEmails: async (_, { url }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const emails = await scrapeEmails(url);
      await saveEmails(emails, url, user.id);
      return emails.map(email => ({
        email,
        sourceUrl: url,
        scrapedAt: new Date().toISOString(),
      }));
    },
    getAllEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const emails = await getAllEmails();
      return emails.filter(email => email.userId.toString() === user.id).map(email => ({
        email: email.email,
        sourceUrl: email.sourceUrl,
        scrapedAt: email.scrapedAt.toISOString(),
      }));
    },
    getRedditEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const emails = await fetchRedditEmails();
      return emails.map(email => ({
        email,
        sourceUrl: 'Reddit',
        scrapedAt: new Date().toISOString(),
      }));
    },
    getUserEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const emails = await getUserEmails(user.id);
      return emails.map(email => ({
        email: email.email,
        sourceUrl: email.sourceUrl,
        scrapedAt: email.scrapedAt.toISOString(),
      }));
    },
  },
  Mutation: {
    scrapeAndSaveRedditEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      try {
        const emails = await fetchRedditEmails();
        if (!emails.length) {
          return {
            success: false,
            message: 'No emails scraped from Reddit',
            emails: [],
          };
        }

        await saveEmails(emails, 'Reddit', user.id);
        const savedEmails = await getEmailsByUrl('Reddit');

        return {
          success: true,
          message: `Saved ${emails.length} emails from Reddit`,
          emails: savedEmails
            .filter(email => email.userId.toString() === user.id)
            .map(email => ({
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
    saveEmails: async (_, { emails }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      await saveEmails(emails.map(e => e.email), emails[0]?.sourceUrl, user.id);
      return emails.map(email => ({
        email: email.email,
        sourceUrl: email.sourceUrl,
        scrapedAt: new Date(email.scrapedAt || Date.now()).toISOString(),
      }));
    },
    downloadEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await generateCSV(user.id);
    },
  },
};

module.exports = [resolvers, userResolvers];