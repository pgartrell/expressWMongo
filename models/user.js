const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username : {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    admin: {
        type: Boolean,
        default: false //By default when a new user doc is created the admoin will be set to false
    }
})

module.exports = mongoose.model('User', userSchema)