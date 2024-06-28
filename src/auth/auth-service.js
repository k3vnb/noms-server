/* eslint-disable no-console */
const bcrypt = require("bcrypt");

const saltRounds = 10;

var salt = bcrypt.genSaltSync(saltRounds);
const hash = syntheticGooglePassword =>
  bcrypt.hashSync(syntheticGooglePassword, salt);

const AuthService = {
  findUserByGoogleId(db, profileId) {
    console.log("Finding user...");
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ googleid: profileId })
      .first();
  },
  findUserById(db, id) {
    console.log("Finding user...");
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ id })
      .first();
  },
  findUserByEmail(db, email) {
    console.log("Finding user...");
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ email })
      .first();
  },
  createUser(db, profile) {
    console.log("Creating user...");
    return db("users")
      .returning(["id", "email", "user_name"])
      .insert({
        user_name: profile.displayName,
        email: profile.emails[0].value,
        password: hash(profile.id),
        googleid: profile.id
      });
  }
};

module.exports = AuthService;
