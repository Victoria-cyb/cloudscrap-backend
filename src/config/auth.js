const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:4000/auth/google/callback',
});

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  googleClient,
};