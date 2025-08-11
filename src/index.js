// // src/index.js
// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const typeDefs = require('./graphql/schema');
// const resolvers = require('./graphql/resolvers');
// const jwt = require('jsonwebtoken');
// const { jwtSecret } = require('./config');
// const User = require('./models/User');
// const { connectToMongo } = require('./services/database');
// const { port } = require('./config');
// const authRoutes = require('./routes/auth');

// const cors = require('cors');

// const app = express();

// app.use(cors({ origin: '*'}));
// app.use(express.json());
// app.use('/auth', authRoutes);

// async function startServer() {
  

//   // Create Apollo Server
//   const server = new ApolloServer({ 
//     typeDefs, 
//     resolvers,
//      context: async ({ req }) => {
//     const authHeader = req.headers.authorization || '';
//     const token = authHeader.replace('Bearer ', '');

//     try {
//       if (!token) return { user: null };

//       const decoded = jwt.verify(token, jwtSecret);
//       const user = await User.findById(decoded.id);
//       console.log("Signing with secret:", jwtSecret);

//       return { user };
//     } catch (error) {
//       console.error('JWT verification failed:', error.message);

//       return { user: null };
//     }
//   }
//       });

//   // Start Apollo Server and apply middleware to Express
//   await server.start();
//   server.applyMiddleware({ app });

//   // Connect to MongoDB
//   await connectToMongo();

//   // Start Express server
//   app.listen(port, () => {
//     console.log(`GraphQL server running at http://localhost:${port}${server.graphqlPath}`);
//   });
// }

// startServer().catch(error => {
//   console.error('Server startup error:', error.message);
//   process.exit(1);
// });



// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');
const User = require('./models/User');
const { connectToMongo } = require('./services/database');
const authRoutes = require('./routes/auth');

const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/auth', authRoutes);

async function bootstrap() {
  try {
    await connectToMongo();
    console.log('MongoDB connected');

    const server = new ApolloServer({ 
      typeDefs, 
      resolvers,
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        try {
          if (!token) return { user: null };

          const decoded = jwt.verify(token, jwtSecret);
          const user = await User.findById(decoded.id);
          console.log("Signing with secret:", jwtSecret);

          return { user };
        } catch (error) {
          console.error('JWT verification failed:', error.message);
          return { user: null };
        }
      }
    });

    await server.start();
    server.applyMiddleware({ app });
    console.log('Apollo Server started');
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error; // Rethrow to crash and log on Vercel
  }
}

// Run bootstrap asynchronously
bootstrap().catch(error => {
  console.error('Server startup error:', error.message);
});

module.exports = app;