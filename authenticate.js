const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt //an object that will provide several helper methods
const jwt = require('jsonwebtoken')

const config = require('./config.js')

//Adding the specific strategy plugin we want to use to our passport implementation
//the .authenticate comes from the passportLocalMongoose that was on the user.js model
exports.local = passport.use(new LocalStrategy(User.authenticate())) //This verifies the username and password against the locally stored username and password
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser()); //??

//This contains an object for a user document
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}) //jwt.sign comes from the jsonwebtoken. Takes the user object and secretKey we created. Make sure to set an expiration 
}

//contains the options for jwt Strategy
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() //specifies how the token shoul be sent from the request message
opts.secretOrKey = config.secretKey

//exporting jwt Strategy. Takes an instance of jwt strategy as an argument
exports.jwtPassport = passport.use (
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload', jwt_payload)
            User.findOne({_id: jwt_payload._id}, (err, user) => { //find a user with the same id as whats in the token
                if(err) {
                    return done(err, false) //If error, send to the second callback to say false that no user was found
                } else if(user) {
                    return done(null, user) //if no error send null meaning no error and returns the user document
                } else {
                    return done(null, false)//no error but no user document found that matched the token
                }
            })
        }
    )
)

exports.verifyUser = passport.authenticate('jwt', {session: false})