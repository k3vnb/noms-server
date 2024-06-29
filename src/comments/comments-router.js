const express = require("express");
const path = require("path");
const CommentsService = require("./comments-service");

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter
  .route("/")
  .all(jsonBodyParser, (req, res, next) => {
    CommentsService.getUserRestaurantComment(
      req.app.get("db"),
      req.body.userId,
      req.body.restaurantId
    ).then(comment => {
      res.userComment = comment;
      next();
    });
  })
  .patch(jsonBodyParser, (req, res) => {
    /*
     *  Check if a user has already upvoted the restaurant
     *  Only users who have upvoted may comment.
     *  res.userComment will be an empty array if user has not upvoted.
     */
    if (!res.userComment.length) {
      return res.status(400).json({
        error: "Users cannot comment unless they have upvoted restaurant"
      });
    }
    /*
     *  Upon initial upvote, a user's comment is set to an empty string.
     *  Therefore posting a 'new' comment is just updating the empty string.
     */
    const { userId, restaurantId, commentId, updatedComment } = req.body;

    CommentsService.updateComment(
      req.app.get("db"),
      userId,
      restaurantId,
      commentId,
      updatedComment
    ).then(newUserRestaurantObj => {
      if (!newUserRestaurantObj.length) {
        return res.status(400).json({
          error: "Could not update comment"
        });
      }

      res
        .status(201)
        .location(
          path.posix.join(
            req.originalUrl,
            `/${newUserRestaurantObj[0].restaurant_id}`
          )
        )
        .json(newUserRestaurantObj[0]);
    });
  });

module.exports = commentsRouter;
