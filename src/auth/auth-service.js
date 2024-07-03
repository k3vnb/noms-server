const { genSaltSync, hashSync } = require("bcrypt");

const SALT_ROUNDS = 10;
const salt = genSaltSync(SALT_ROUNDS);
const hash = syntheticGooglePassword => hashSync(syntheticGooglePassword, salt);

const AuthService = {
  findUserByGoogleId(db, profileId) {
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ googleid: profileId })
      .first();
  },
  findUserById(db, id) {
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ id })
      .first();
  },
  findUserByEmail(db, email) {
    return db
      .select("id", "email", "user_name")
      .from("users")
      .where({ email })
      .first();
  },
  createUser(db, profile) {
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
