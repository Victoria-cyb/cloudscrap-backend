// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { connectToMongo } = require('./services/database');
const { port } = require('./config');

async function startServer() {
  // Create Express app
  const app = express();

  // Create Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });

  // Start Apollo Server and apply middleware to Express
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  await connectToMongo();

  // Start Express server
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Server startup error:', error.message);
  process.exit(1);
});