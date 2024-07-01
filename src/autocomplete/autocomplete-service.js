const uuid = require("uuid");
const fetch = require("node-fetch");

const autocompleteService = {
  async fetchResults(query, sessionToken = uuid.v4()) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURI(
      query
    )}&types=establishment&location=45.5230,-122.6675&radius=16093&strictbounds&offset=3&key=${
      process.env.GOOGLE_PLACES_API_KEY
    }&sessiontoken=${sessionToken}`;

    const data = await fetch(url);

    return data;
  }
};

module.exports = autocompleteService;
