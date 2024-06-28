/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const cookieParser = require("cookie-parser");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const { NODE_ENV, requestOrigin } = require("./config");
const keys = require("./config/keys");
const autocompleteRouter = require("./autocomplete/autocomplete-router");
const restaurantsRouter = require("./restaurants/restaurants-router");
const commentsRouter = require("./comments/comments-router");
const upvotesRouter = require("./upvotes/upvotes-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const db = require("./db");
const AuthService = require("./auth/auth-service");
const {
  googleStrategyConfig,
  googleStrategyVerifyFn
} = require("./config/passport-setup");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const IS_PROD = NODE_ENV === "production";

const app = express();
app.set("db", db);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(IS_PROD ? "tiny" : "common"));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: requestOrigin
  })
);

app.use(cookieParser(keys.session.cookieKey));
const cookieSessionConfig = {
  sameSite: "none",
  httpOnly: false,
  // 4 hour sessions
  maxAge: 4 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
};
if (IS_PROD) {
  app.set("trust proxy", 1);
  cookieSessionConfig.secure = true;
}
// app.use(cookieSession(cookieSessionConfig));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("Serializing user in init...", !!user, user);
  done(null, user.id);
});
// app.use(passport.authenticate('session'));

passport.deserializeUser(function(id, done) {
  console.log("Deserializing user in init...", !!id, id);
  AuthService.findUserById(db, id)
    .then(async usr => {
      console.log("User found deserialize: ", usr);
      if (usr) return done(null, usr);
      return done(null, false);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log("Error in passport-setup.js", err);
      return done(err, false);
    });
});
passport.use(new GoogleStrategy(googleStrategyConfig, googleStrategyVerifyFn));

app.use("/api/search", autocompleteRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/upvotes", upvotesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.get("/", (_req, res) => {
  res.send("hello world");
});

// eslint-disable-next-line prefer-arrow-callback
app.use(function errorHandler(error, _req, res, _next) {
  let response;
  if (IS_PROD) {
    response = { error: { message: "server error" } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
