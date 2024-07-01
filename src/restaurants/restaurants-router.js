const express = require("express");
const path = require("path");
const RestaurantsService = require("./restaurants-service");
const { VALID_FOOD_CATEGORIES } = require("../../constants");

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

restaurantsRouter
  .route("/")
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(req.app.get("db"))
      .then(restaurants => {
        res.json(restaurants.map(RestaurantsService.serializeRestaurant));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      restaurant_name,
      food_category,
      subtitle,
      address,
      nominated_by_user,
      googleid,
      comment = ""
    } = req.body;

    const newRestaurant = {
      restaurant_name,
      food_category,
      subtitle,
      address,
      googleid,
      nominated_by_user,
      comment
    };

    for (const [key, value] of Object.entries(newRestaurant))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    if (!VALID_FOOD_CATEGORIES.includes(food_category))
      return res.status(400).json({
        error: "Invalid food_category parameter"
      });

    RestaurantsService.postNewRestaurant(req.app.get("db"), newRestaurant)
      .then(restaurant => {
        res.restaurant = restaurant;
        return restaurant;
      })
      .then(restaurant =>
        RestaurantsService.getCommentsAndUsers(req.app.get("db"), restaurant.id)
      )
      .then(comments => {
        res.restaurant.comments = comments;
      })
      .then(() => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${res.restaurant.id}`))
          .json(
            RestaurantsService.serializeRestaurantUsersAndComments(
              res.restaurant
            )
          );
      })
      .catch(next);
  });

restaurantsRouter.route("/likes").get((req, res) => {
  RestaurantsService.getAllLikesAndComments(req.app.get("db")).then(data =>
    res.json(data)
  );
});

restaurantsRouter
  .route("/likes/:restaurant_id")
  .all(checkRestaurantExists)
  .get((req, res) => {
    RestaurantsService.getCommentsAndUsers(
      req.app.get("db"),
      req.params.restaurant_id
    ).then(comments => {
      res.restaurant.comments = comments;
      res.json(
        RestaurantsService.serializeRestaurantUsersAndComments(res.restaurant)
      );
    });
  });

async function checkRestaurantExists(req, res, next) {
  try {
    const restaurant = await RestaurantsService.getRestaurantById(
      req.app.get("db"),
      req.params.restaurant_id
    );
    if (!restaurant)
      return res.status(404).json({
        error: "Restaurant does not exist"
      });

    res.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = restaurantsRouter;
