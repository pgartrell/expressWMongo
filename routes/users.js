const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username }) //to see if there are any existing user documents
    //If the promise is resolved, we'll have a user document or a null value which means no user document was found with a matching name
    .then((user) => {
      //If user was found with a matching name, error. Else if not found create new user document
      if (user) {
        const err = new Error(`User ${req.body.username} already exists!`);
        err.status = 403;
        return next(err);
      } else {
        User.create({
          username: req.body.username,
          password: req.body.password,
        })
          //The create method returns a promise. The .then method below resolves the user that was created
          .then((user) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "Registration Successful!", user: user });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err)); //This is in case the findOne method returns a rejected promise meaninig something went wrong to findOne method and passes it onto the express error handler
});

router.post("/login", (req, res, next) => {
  //Check if already tracking an authenticated session with the user. If not,
  if (!req.session.user) {
    //signedCookies comes from cookie parser, it automatically parse a signed cookie from the request. If not properly signed it returns false
    const authHeader = req.headers.authorization;
    //If the client has not authenticated then we go into the if statement
    if (!authHeader) {
      const err = new Error("You are not authenticated");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err); //sends authentication err message and request back to the client
    }

    //Buffer is a global class in node. So no need to require it
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];

    //Take the un and pw the client sent and check against the user documents we have in our database. If thats the case we can successfully authenticate
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          const err = new Error(`User ${username} does not exist!`);
          err.status = 401;
          return next(err);
        } else if (user.password !== password) {
          const err = new Error("Your password is incorrect!");
          err.status = 401;
          return next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = "authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You are authenticated");
        }
      })
      .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are already authenticated!");
  }
});

router.get('/logout', (req, res, next) => {
  //Check if a session exists
  if (req.session) {
    //.destroy means deleting the session file on the server side and if the client trys to authenticate with that session id it will not be recognized by the server as a valid session
    req.session.destroy()
    res.clearCookie('session-id') // clears cookie stored on client
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!')
    err.status = 401
    return next(err)
  }
})

module.exports = router;
