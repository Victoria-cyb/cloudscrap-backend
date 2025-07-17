// src/graphql/schema/index.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Email {
    email: String!
    sourceUrl: String!
    scrapedAt: String!
  }

  type ScrapeResult {
    success: Boolean!
    message: String!
    emails: [Email!]
  }

  type Query {
    getEmails(url: String!): [Email]
    getAllEmails: [Email]
    getRedditEmails: [Email] # New query for Reddit emails
  }

  type Mutation {
    scrapeAndSaveRedditEmails: ScrapeResult # New mutation for Reddit scraping
  }
`;

module.exports = typeDefs;