const { SITE_URL_PROD, SITE_URL_DEV, DEFAULT_PORT } = require("../constants");

const IS_PROD = process.env.NODE_ENV === "production";
const SITE_URL = IS_PROD ? SITE_URL_PROD : SITE_URL_DEV;

module.exports = {
  PORT: process.env.PORT || DEFAULT_PORT,
  IS_PROD,
  SITE_URL
};
