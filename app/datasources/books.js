"use strict";

const sparql = require("jsparql");

const oneBookTemplate = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dbpedia: <http://dbpedia.org/resource/>
  PREFIX ontology: <http://dbpedia.org/ontology/>
  PREFIX property: <http://dbpedia.org/property/>

  select ?author_name ?isbn ?name ?abstract
  where {
  ?s rdf:type ontology:Book .
    ?s ontology:author ?author .
    OPTIONAL {?author property:name ?author_name} .
    ?s ontology:isbn ?isbn .
    ?s foaf:name ?name .
    ?s ontology:abstract ?abstract .
    FILTER (regex(?isbn, "ISBN 978-1-68142-575-7"))
  }
`;

const allBooksTemplate = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dbpedia: <http://dbpedia.org/resource/>
  PREFIX ontology: <http://dbpedia.org/ontology/>
  PREFIX property: <http://dbpedia.org/property/>

  select ?author_name ?isbn ?name ?abstract
  where {
  ?s rdf:type ontology:Book .
    ?s ontology:author ?author .
    OPTIONAL {?author property:name ?author_name} .
    ?s ontology:isbn ?isbn .
    ?s foaf:name ?name .
    ?s ontology:abstract ?abstract .
  }
  LIMIT {{limit}}
`;

class Books {
  constructor() {
    this.client = new sparql('http://dbpedia.org/sparql', 'http://dbpedia.org');
  }

  build(template, params) {
    return template.replace(/{{(\w*)}}/g,(m,key) => {
      return params.hasOwnProperty(key) ? params[key] : "";
    });
  }

  findOne(isbn) {
    return new Promise((resolve, reject) => {
      this.client.query(this.build(oneBookTemplate, {isbn: isbn}), (err, results) => {
        if (err) return reject(err);

        const data = results.results.bindings[0];
        const book = {};
        book.name = data.name.value;
        book.isbn = data.isbn.value;
        book.abstract = data.abstract.value;
        book.author = {
          name: data.author_name || "Unknown author"
        };

        return resolve(book);
      });
    });
  }

  find(limit) {
    return new Promise((resolve, reject) => {
      this.client.query(this.build(allBooksTemplate, {limit: limit}), (err, results) => {
        if (err) return reject(err);

        const data = results.results.bindings.map((res) => {
          const book = {};
          book.name = res.name.value;
          book.isbn = res.isbn.value;
          book.abstract = res.abstract.value;
          book.author = {
            name: res.author_name ? res.author_name.value : "Unknown author"
          };

          return book;
        });

        return resolve(data);
      });
    });
  }
}

module.exports = () => {
  return new Books();
};