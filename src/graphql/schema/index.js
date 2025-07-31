const { mergeTypeDefs } = require('@graphql-tools/merge');
const userSchema = require('./user');
const emailSchema = require('./email');

const typeDefs = mergeTypeDefs([userSchema, emailSchema]);

module.exports = typeDefs;
