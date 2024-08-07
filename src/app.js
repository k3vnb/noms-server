require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

// ROUTES
const autocompleteRouter = require("./autocomplete/autocomplete-router");
const restaurantsRouter = require("./restaurants/restaurants-router");
const commentsRouter = require("./comments/comments-router");
const upvotesRouter = require("./upvotes/upvotes-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

// DB & Auth Config
const db = require("./db");
const {
  googleStrategy,
  handleSerializeUser,
  handleDeserializeUser
} = require("./auth/passport-config");
const { IS_PROD, SITE_URL } = require("./config");

// Create express app instance & set db
const app = express();
app.set("db", db);

// Top level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(IS_PROD ? "tiny" : "common"));
app.use(helmet());

app.use(
  cors({
    credentials: true,
    origin: SITE_URL,
    accessControlAllowOrigin: SITE_URL
  })
);

app.use(cookieParser());

app.use(
  session({
    cookie: {
      maxAge: 86400000 // 24h
    },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

if (IS_PROD) {
  app.set("trust proxy", 1);
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(handleSerializeUser);
passport.deserializeUser(handleDeserializeUser);
passport.use(googleStrategy);

// Routes
app.use("/api/search", autocompleteRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/upvotes", upvotesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.get("/", (_req, res) => {
  res.send("hello world");
});

app.use(function errorHandler(error, _req, res) {
  let response;
  if (IS_PROD) {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
