"use strict";

const MongoClient = require('mongodb').MongoClient;

const csv = require("fast-csv");
const fs = require("fs");
const async = require("async");

MongoClient.connect("mongodb://localhost:27017/GraphQLExample", (err, db) => {
  if (err) {
    console.log(err);
    process.exit();
  }

  db.collection("users", (err, users) => {
    let USERS_COUNT;
    users.count().then((count) => {
      USERS_COUNT = count;
    }).then(() => {
      fs.createReadStream("./data/isins.csv")
        .pipe(csv())
        .on("data", function(data){
          users.findOne({}, {skip: Math.random() * USERS_COUNT}, (err, user) => {
            users.update({_id: user._id}, {$push: {books: data}});
          });
        })
        .on("end", function(){
            console.log("done");
        });
    });
  });

});