// /* eslint-disable func-names */
// /* eslint-disable prefer-arrow-callback */
// const passport = require("passport");
// const AuthService = require("./auth-service");

// module.exports = function (db) {
//   passport.serializeUser(function (user, done) {
//     console.log("Serializing user in init...", !!user, user);
//     done(null, user.id);
//   });

//   passport.deserializeUser(function (id, done) {
//     console.log("Deserializing user in init...", !!id);
//     AuthService.findUserById(db, id)
//       .then(async usr => {
//         console.log("User found deserialize: ", usr);
//         if (usr) return done(null, usr);
//         return done(null, false);
//       })
//       .catch(err => {
//       // eslint-disable-next-line no-console
//         console.log("Error in passport-setup.js", err);
//         return done(err, false);
//       });
//   });
// };
