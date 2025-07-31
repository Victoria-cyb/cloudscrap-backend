const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  console.log('Auth Header:', authHeader); // Debug
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Debug
    try {
      const user = jwt.verify(token, jwtSecret);
      console.log('Decoded User:', user); // Debug
      return { user };
    } catch (error) {
      console.error('Token Verification Error:', error.message); // Debug
      throw new Error('Invalid token');
    }
  }
  console.log('No Auth Header Provided'); // Debug
  return { user: null };
};