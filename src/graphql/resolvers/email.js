const { getUserEmails, saveEmails, generateCSV } = require('../../services/database');

module.exports = {
  Query: {
    getUserEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await getUserEmails(user.id);
    },
  },
  Mutation: {
    saveEmails: async (_, { emails }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await saveEmails(emails.map(e => e.email), emails[0]?.sourceUrl, user.id);
    },
    downloadEmails: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await generateCSV(user.id);
    },
  },
};