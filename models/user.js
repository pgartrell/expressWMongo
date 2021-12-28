const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    admin: {
        type: Boolean,
        default: false //By default when a new user doc is created the admoin will be set to false
    }
})

userSchema.plugin(passportLocalMongoose) //provides us with different methods like the authenticate method to be used on the next file. 

module.exports = mongoose.model('User', userSchema)