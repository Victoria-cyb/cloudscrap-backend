const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Email {
    id: ID!
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
    getRedditEmails: [Email]
    getUserEmails: [Email!]!
  }

  type Mutation {
    scrapeAndSaveRedditEmails: ScrapeResult
    saveEmails(emails: [EmailInput!]!): [Email!]!
    downloadEmails: String!
  }

  input EmailInput {
    email: String!
    sourceUrl: String!
    scrapedAt: String
  }
`;

module.exports = typeDefs;
