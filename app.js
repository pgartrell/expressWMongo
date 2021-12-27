var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require('express-session') //session is used to store information permanantly from session to session unlike cookies that just store it locally
const FileStore = require('session-file-store')(session) //The require function is returning another function as its return value and we are calling the function with session

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");

const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/nucampsite";
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Different way to handle promises. Pass in second argument logging the error to the console.
connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
  //***Note: not advisable to use cookie parser with express. 
// app.use(cookieParser("12345-67890-09876-54321")); //This number can be anything, it just needs a string

app.use(session({
  name: 'session-id',
  secret: "12345-67890-09876-54321",
  saveUninitialized: false, //When a new session is created but no updates made, it will not saved and no cookie will be sent since it will be empty
  resave: false,
  store: new FileStore() //Creates the new filestore as an object that we can save our session information to the harddisk
}))

//Authentication is put here so that users have to authenticate before they access any data in the server
function auth(req, res, next) {
  console.log(req.session)
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
    const user = auth[0];
    const pass = auth[1];
    if (user === "admin" && pass === "password") {
      req.session.user = 'admin' //Using this to set up the new cookie
      return next(); //has been authorized
    } else {
      const err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    //If there is a signed cookie
  } else {
    if (req.session.user === "admin") {
      return next();
    } else {
      const err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth); //parse the auth header and validate the username and password

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
