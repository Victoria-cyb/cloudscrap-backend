const { signUp, signIn, googleSignIn } = require('../../services/auth');
const User = require('../../models/User');

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await User.findById(user.id);
    },
  },
  Mutation: {
    signUp: async (_, args) => {
      const token = await signUp(args);
      return { token };
    },
    signIn: async (_, { email, password }) => {
      const token = await signIn({ email, password });
      return { token };
    },
    googleSignIn: async (_, { token }) => {
      const authToken = await googleSignIn(token);
      return { token: authToken };
    },
  },
};