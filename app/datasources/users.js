"use strict";

const mongojs = require('mongojs');

class Users {
  constructor() {
    this.db = mongojs("localhost/GraphQLExample")
    this.col = this.db.collection("users");
  }

  findOne(email) {
    const query = {};

    query.email = email;

    return new Promise((resolve, reject) => {
      this.col.findOne(query, (err, user) => {
        if (err) return reject(err);
        return resolve(user);
      });
    });
  }

  find(limit) {
    return new Promise((resolve, reject) => {
      this.col.find().limit(limit, (err, users) => {
        if (err) return reject(err);
        return resolve(users);
      });
    });
  }
};

module.exports = () => {
  return new Users();
};