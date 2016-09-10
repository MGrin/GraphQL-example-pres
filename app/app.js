"use strict";

const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();

app.datasources = require('./datasources');

app
  .use('/graphql', graphqlHTTP({
    schema:  require('./schemas'),
    pretty: true,
    graphiql: true,
    context: app
  }))
  .listen(3000);