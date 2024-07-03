const { SITE_URL_PROD, SITE_URL_DEV } = require("../constants");

const IS_PROD = process.env.NODE_ENV === "production";
const SITE_URL = IS_PROD ? SITE_URL_PROD : SITE_URL_DEV;

module.exports = {
  PORT: process.env.PORT || 8000,
  IS_PROD,
  SITE_URL
};
