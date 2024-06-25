const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig);

console.log("Connected to the database...");

module.exports = db;
