const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
 const { googleClient, jwtSecret } = require('../config');
// const googleClient = require('../config').googleClient;
// const jwtSecret = '123456'; // TEMP hardcoded secret


const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
};

const googleSignIn = async (token) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { sub: googleId, email, given_name, family_name } = ticket.getPayload();

  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId,
        email,
        firstName: given_name,
        lastName: family_name,
      });
    } else {
      user.googleId = googleId;
      await user.save();
    }
  }

  return generateToken(user);
};

const signUp = async ({ firstName, lastName, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword });
  return generateToken(user);
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  console.log("Signing with secret:", jwtSecret);
  return generateToken(user);
  
};

module.exports = { googleSignIn, signUp, signIn };