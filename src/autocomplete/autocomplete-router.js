const express = require("express");
const autocompleteService = require("./autocomplete-service");

const autocompleteRouter = express.Router();
const jsonBodyParser = express.json();

autocompleteRouter.route("/:querystring").put(jsonBodyParser, (req, res) => {
  autocompleteService
    .fetchResults(req.params.querystring, req.body.sessionToken)
    .then(response => response.json())
    .then(response => {
      const filterTypes = [
        "bakery",
        "meal_takeaway",
        "restaurant",
        "cafe",
        "bar",
        "food"
      ];
      const filterPredictions = response.predictions.filter(prediction =>
        prediction.types.some(type => filterTypes.includes(type))
      );
      res.send({ ...response, predictions: filterPredictions });
    })
    // TO DO flesh out error handling
    .catch(err => {
      res.status(401).json({
        message: "Could not fetch data",
        err: err.message
      });
    });
});

module.exports = autocompleteRouter;
