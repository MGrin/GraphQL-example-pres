"use strict";

const graphql = require('graphql');
const book = require('./book');

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    email: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    picture: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    books: {
      type: book.type
    }
  }
});

module.exports = {
  type: userType,
  args: {
    email: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },

  resolve: (obj, args, app) => {
    return app.datasources.users.findOne(args.email);
  }
}