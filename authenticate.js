const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

//Adding the specific strategy plugin we want to use to our passport implementation
//the .authenticate comes from the passportLocalMongoose that was on the user.js model
exports.local = passport.use(new LocalStrategy(User.authenticate())) //This verifies the username and password against the locally stored username and password
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser()); //??