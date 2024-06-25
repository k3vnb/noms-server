const express = require("express");
const passport = require("passport");
const { requestOrigin } = require("../config");

const authRouter = express.Router();

authRouter.get(
  "/google-oauth",
  passport.authenticate("google", {
    scope: ["openid", "email", "profile"]
  })
);

authRouter.get(
  "/google/redirect",
  passport.authenticate("google"),
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
