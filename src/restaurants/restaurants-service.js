const xss = require("xss");

const RestaurantsService = {
  getAllRestaurants(db) {
    return db
      .from("restaurants AS noms")
      .select(
        "noms.id",
        "noms.name",
        "noms.subtitle",
        "noms.address",
        "noms.date_nominated",
        "noms.nominated_by_user",
        "noms.food_category",
        "noms.googleid",
        db.raw("count(lc.user_id) as vote_count")
      )
      .leftJoin("likes_and_comments AS lc", "noms.id", "lc.restaurant_id")
      .groupBy("noms.id");
  },
  getRestaurantById(db, restaurantId) {
    return db
      .from("restaurants AS noms")
      .select("noms.*", db.raw("count(lc.user_id) as vote_count"))
      .where("noms.id", restaurantId)
      .first()
      .leftJoin("likes_and_comments AS lc", "noms.id", "lc.restaurant_id")
      .groupBy("noms.id");
  },
  getCommentsAndUsers(db, restaurantId) {
    return db
      .from("likes_and_comments AS lc")
      .select("lc.*", "users.user_name")
      .where("lc.restaurant_id", restaurantId)
      .leftJoin("users", "lc.user_id", "users.id")
      .groupBy("lc.id", "lc.date_commented", "users.user_name");
  },
  getAllLikesAndComments(db) {
    return db.from("likes_and_comments").select("*");
  },
  postNewRestaurant(db, newRestaurant) {
    const {
      restaurant_name: name,
      food_category,
      subtitle,
      address,
      nominated_by_user,
      googleid,
      comment
    } = newRestaurant;

    return db
      .insert({
        name,
        food_category,
        nominated_by_user,
        subtitle,
        googleid,
        address
      })
      .into("restaurants")
      .returning("*")
      .then(([restaurant]) => restaurant)
      .then(restaurant =>
        RestaurantsService.postNewLikesComments(db, restaurant, comment)
      );
  },
  postNewLikesComments(db, restaurant, comment) {
    const { id, nominated_by_user } = restaurant;
    return db
      .insert({
        user_id: nominated_by_user,
        restaurant_id: id,
        comment
      })
      .into("likes_and_comments")
      .returning("*")
      .then(([lc]) =>
        RestaurantsService.getRestaurantById(db, lc.restaurant_id)
      );
  },
  serializeRestaurant(restaurant) {
    const {
      id,
      name,
      date_nominated,
      subtitle,
      address,
      googleid,
      nominated_by_user,
      food_category,
      vote_count
    } = restaurant;

    return {
      id,
      name: xss(name),
      subtitle: xss(subtitle),
      address: xss(address),
      date_nominated,
      googleid: xss(googleid),
      nominated_by_user,
      food_category,
      vote_count
    };
  },
  serializeComments(comments) {
    const {
      id,
      user_id,
      restaurant_id,
      comment,
      date_liked,
      date_commented,
      user_name
    } = comments;

    return {
      id,
      user_id,
      restaurant_id,
      comment: xss(comment),
      date_liked,
      date_commented,
      user_name: xss(user_name)
    };
  },
  serializeRestaurantUsersAndComments(restaurant) {
    const serializedRestaurant = this.serializeRestaurant(restaurant);
    const { comments = [] } = restaurant;

    return {
      ...serializedRestaurant,
      comments: comments.map(comment => this.serializeComments(comment))
    };
  }
};

module.exports = RestaurantsService;
