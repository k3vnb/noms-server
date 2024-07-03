const express = require("express");
const passport = require("passport");
const { SITE_URL } = require("../config");

const authRouter = express.Router();

// login
authRouter.get(
  "/google-oauth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// callback route for google to redirect to
authRouter.get(
  "/google/redirect",
  passport.authenticate("google", {
    successReturnToOrRedirect: SITE_URL,
    failureRedirect: SITE_URL,
    failureMessage: true
  }),
  (_req, res) => {
    res.redirect(SITE_URL);
  }
);

authRouter.get("/unsuccessful", (_req, res) =>
  res.send("redirect unsuccessful")
);

authRouter.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect(SITE_URL);
  });
});

module.exports = authRouter;
