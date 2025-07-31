const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    signUp(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload!
    signIn(email: String!, password: String!): AuthPayload!
    googleSignIn(token: String!): AuthPayload!
  }
`;

module.exports = typeDefs;