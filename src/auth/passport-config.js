const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthService = require("./auth-service");
const UsersService = require("../users/users-service");
const db = require("../db");

const GOOGLE_STRATEGY_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/redirect"
};

function handleGoogleStrategyResponse(accessToken, refreshToken, profile, cb) {
  const email = profile.emails?.[0]?.value;
  if (!email) return cb(null, false, { message: "No email provided" });

  // Find or Create User in DB
  AuthService.findUserByEmail(db, email)
    .then(async usr => {
      if (usr) return cb(null, usr);

      /*
          in our db, user_name can only be unique,
          however the Google displayName is not necessarily unique
          to avoid an error if two users with, ie, displayName 'John Smith' try to join,
          we first check if username exists,
          if so, we get a unique number to concat on the displayName
      */

      const newProfile = { ...profile };
      const checkUsrNameExists = await UsersService.checkUserNameExists(
        db,
        profile.displayName
      );
      if (checkUsrNameExists[0]) {
        const uniqueId = await UsersService.getHighestId(db);
        newProfile.displayName = `${profile.displayName} ${uniqueId[0].id + 1}`;
      }
      AuthService.createUser(db, newProfile).then(newUsr => {
        return cb(null, newUsr[0]);
      });
    })
    .catch(err => {
      console.log("Error in passport-setup.js", err);
    });
}

const googleStrategy = new GoogleStrategy(
  GOOGLE_STRATEGY_CONFIG,
  handleGoogleStrategyResponse
);

// PASSPORT SERIALIZE / DESERIALIZE FUNCS
function handleSerializeUser(user, cb) {
  cb(null, user.id);
}

function handleDeserializeUser(id, cb) {
  AuthService.findUserById(db, id)
    .then(async usr => {
      if (usr) return cb(null, usr);
      return cb(null, false);
    })
    .catch(err => {
      console.log("Error in deserializeUser", err);
      return cb(err, false);
    });
}

module.exports = {
  googleStrategy,
  handleSerializeUser,
  handleDeserializeUser
};
