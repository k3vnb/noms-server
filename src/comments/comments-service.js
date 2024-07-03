const xss = require("xss");

const CommentsService = {
  getUserRestaurantComment(db, userId, restaurantId) {
    return db
      .from("likes_and_comments")
      .select("comment")
      .where({
        user_id: userId,
        restaurant_id: restaurantId
      })
      .first();
  },
  updateComment(db, userId, restaurantId, commentId, updatedComment) {
    return db
      .into("likes_and_comments")
      .where({
        user_id: userId,
        restaurant_id: restaurantId,
        id: commentId
      })
      .update({
        comment: xss(updatedComment)
      })
      .returning("*");
  }
};

module.exports = CommentsService;
