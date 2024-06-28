const express = require("express");
const passport = require("passport");
const { requestOrigin } = require("../config");

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
    successReturnToOrRedirect: requestOrigin,
    failureRedirect: requestOrigin,
    failureMessage: true
  }),
  (_req, res) => {
    console.log("redirecting...", _req.user ? _req.user.id : "no user");
    res.redirect(`${requestOrigin}`);
  }
);

authRouter.get("/unsuccessful", (_req, res) =>
  res.send("redirect unsuccessful")
);

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect(requestOrigin);
});

module.exports = authRouter;
