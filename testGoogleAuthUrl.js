// testGoogleAuthUrl.js
const { google } = require('googleapis');
const { googleClient } = require('./src/config');

const authUrl = googleClient.generateAuthUrl({
  scope: ['profile', 'email'],
  redirect_uri: 'http://localhost:4000/auth/google/callback',
});
console.log('Authorization URL:', authUrl);