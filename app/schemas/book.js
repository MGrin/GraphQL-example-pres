"use strict";

const graphql = require('graphql');

const authorType =  new graphql.GraphQLObjectType({
  name: 'Author',
  fields: {
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  }
});

const bookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: {
    isbn: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    abstract: {
      type: graphql.GraphQLString
    },
    author: {
      type:  new graphql.GraphQLNonNull(authorType)
    },
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  }
});

module.exports = {
  type: bookType,
  args: {
    isbn: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: (obj, args, ctx) => {
    return ctx.datasources.books.findOne(args.isbn);
  }
}