const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require('./cors')

const router = express.Router();

/* GET users listing. */
router
.get("/", cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find()
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      })
      .catch((err) => next(err));
  }
)

router.post("/signup", cors.corsWithOptions, (req, res) => {
  User.register(
    new User({ username: req.body.username }), // new user created with a name given to us from the client
    req.body.password,
    //Callback method that recieves an error if there was one from the register method or it will be null if no error
    (err, user) => {
      if (err) {
        res.statusCode = 500; //server error
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        //Check if firstname was sent and send request to that body
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        //save to database and handle errors
        user.save((err) => {
          if(err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({err: err})
            return
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" }); //res.json takes care of sending the response so no need to end in any other way
          });
        });
      }
    }
  );
});

//passing in passport.authenticate enables passport authentication on this route and if no error it continues to next middleware function
//So we don't need to do any conditional statements like before because the passport.authenticate handles all of that
router.post("/login", cors.corsWithOptions, passport.authenticate("local"), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id }); //issue a token to user after authentication
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

router.get("/logout", cors.corsWithOptions, (req, res, next) => {
  //Check if a session exists
  if (req.session) {
    //.destroy means deleting the session file on the server side and if the client trys to authenticate with that session id it will not be recognized by the server as a valid session
    req.session.destroy();
    res.clearCookie("session-id"); // clears cookie stored on client
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
      const token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
