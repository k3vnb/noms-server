module.exports = {
  client: "pg",
  connection: {
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false
    }
  }
};
