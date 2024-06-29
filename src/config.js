module.exports = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://kevin@localhost/noms",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "postgresql://kevin@localhost/noms",
  NODE_ENV: process.env.NODE_ENV || "development",
  REQ_ORIGIN:
    process.env.NODE_ENV === "production"
      ? "https://www.nomspdx.com"
      : "http://localhost:3000"
};
