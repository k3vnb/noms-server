require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, requestOrigin } = require("./config");
const keys = require("./config/keys");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("./config/passport-setup");

const autocompleteRouter = require("./autocomplete/autocomplete-router");
const restaurantsRouter = require("./restaurants/restaurants-router");
const commentsRouter = require("./comments/comments-router");
const upvotesRouter = require("./upvotes/upvotes-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", requestOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser(keys.session.cookieKey));
app.use(
  cookieSession({
    // 4 hour sessions
    maxAge: 4 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/autocomplete", autocompleteRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/upvotes", upvotesRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

// eslint-disable-next-line prefer-arrow-callback
app.use(function errorHandler(error, _req, res, _next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
