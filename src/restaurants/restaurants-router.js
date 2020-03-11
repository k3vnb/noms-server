const express = require("express");
const path = require("path");
const RestaurantsService = require("./restaurants-service");

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
    // TO DO require auth
    const {
      restaurant_name,
      food_category,
      subtitle,
      address,
      comment = ""
    } = req.body;
    const newNom = {
      restaurant_name,
      food_category,
      subtitle,
      address,
      comment
    };
    // TO DO extract food categories array to its own file for import
    const validFoodCategories = ["Burger", "Falafel", "Burrito", "Pizza"];
    for (const [key, value] of Object.entries(newNom))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    if (!validFoodCategories.includes(food_category))
      return res.status(400).json({
        error: "Invalid food_category parameter"
      });

    // newNom.user_id = req.user.id
    // Auth needed, right now there are 8 dummy users
    newNom.nominated_by_user = Math.floor(Math.random() * 8) + 1;
    // TO DO write RestaurantService.insertNewNomination
    RestaurantsService.postNewRestaurant(req.app.get("db"), newNom)
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
