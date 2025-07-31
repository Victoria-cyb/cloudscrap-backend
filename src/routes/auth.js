const express = require('express');
const router = express.Router();
const { googleClient } = require('../config');
const { googleSignIn } = require('../services/auth');

router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  console.log('Received code:', code);
  console.log('Redirect URI:', 'http://localhost:4000/auth/google/callback');
  try {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: 'http://localhost:4000/auth/google/callback',
    });
    console.log('Tokens:', tokens); // Debug
    const token = await googleSignIn(tokens.id_token);
    res.json({ token });
  } catch (error) {
    console.error('Google OAuth error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;