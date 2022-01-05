const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    //fistname and lastname will be used with .populate() to pull info from user documents to populate the comments subdocuments
    firstname:{
        type: String,
        default: ""
    },
    lastname:{
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false //By default when a new user doc is created the admoin will be set to false
    }, 
    facebookId: String,
})

userSchema.plugin(passportLocalMongoose) //provides us with different methods like the authenticate method to be used on the next file. 

module.exports = mongoose.model('User', userSchema)