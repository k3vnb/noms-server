const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const knex = require("knex");
const keys = require("./keys");
const AuthService = require("../auth/auth-service");
const UsersService = require("../users/users-service");

const knexConfig = require("../knexfile");

const db = knex(knexConfig);
passport.initialize();
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/api/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      // eslint-disable-next-line no-console
      console.log("Connecting to Google...");
      AuthService.findUserById(db, profile.id).then(async usr => {
        if (usr) return done(null, usr);
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
          newProfile.displayName = `${profile.displayName} ${uniqueId[0].id +
            1}`;
        }
        AuthService.createUser(db, newProfile).then(newUsr => {
          return done(null, newUsr[0]);
        });
      });
    }
  )
);
