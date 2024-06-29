const express = require("express");
const passport = require("passport");
const { REQ_ORIGIN } = require("../config");

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
    successReturnToOrRedirect: REQ_ORIGIN,
    failureRedirect: REQ_ORIGIN,
    failureMessage: true
  }),
  (_req, res) => {
    console.log("redirecting...", _req.user ? _req.user.id : "no user");
    res.redirect(REQ_ORIGIN);
  }
);

authRouter.get("/unsuccessful", (_req, res) =>
  res.send("redirect unsuccessful")
);

authRouter.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    console.log("logging out...", !!err, err);
    if (err) {
      return next(err);
    }
    res.redirect(REQ_ORIGIN);
  });
});

module.exports = authRouter;
