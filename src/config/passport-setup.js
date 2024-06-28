/* eslint-disable indent */
/* eslint-disable func-names */
const keys = require("./keys");
const AuthService = require("../auth/auth-service");
const UsersService = require("../users/users-service");
const db = require("../db");

const googleStrategyConfig = {
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: "/api/auth/google/redirect"
};

const googleStrategyVerifyFn = function verify(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  // eslint-disable-next-line no-console
  const email = profile.emails?.[0]?.value;
  if (!email) return cb(null, false, { message: "No email provided" });
  AuthService.findUserByEmail(db, email)
    .then(async usr => {
      console.log("User found strategy: ", usr);
      if (usr) return cb(null, usr);
      console.log("shouldnt run");
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
      // eslint-disable-next-line no-console
      console.log("Error in passport-setup.js", err);
    });
};

module.exports = {
  googleStrategyConfig,
  googleStrategyVerifyFn
};
