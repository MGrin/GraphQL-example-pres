"use strict";

const graphql = require('graphql');
const user = require('./user');
const book = require('./book');

module.exports = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      user: user,
      users: {
        type: new graphql.GraphQLList(user.type),
        args: {
          limit: {
            type: graphql.GraphQLString
          }
        },
        resolve: (obj, args, app) => {
          return app.datasources.users.find(parseInt(args.limit) || 10);
        }
      },

      book: book,
      books: {
        type: new graphql.GraphQLList(book.type),
        args: {
          limit: {
            type: graphql.GraphQLString
          }
        },
        resolve: (obj, args, app) => {
          return app.datasources.books.find(parseInt(args.limit) || 10);
        }
      },
    }
  })
});