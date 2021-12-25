//Defining mongoose Schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema //Shorthand so we only have to refer to it as Schema

//first argument is required. An object that contains a definition for the Schema via the objects properties
//Second argument is optional, setting optional configurations
const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //no two documents should have the same name field
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean, 
        required: false
    },
    description: {
        type: String,
        required: true,
    },

}, 

{
    timestamps: true //Cause mongoose to automatically add two properties: createdAt and updatedAt property.

})

//Creates a model named campsite. We are using this for the collection called campsites
//mongoose looks for the lowercase plural version of campsite
//This will return a constructor function
const Partner = mongoose.model('Partner', partnerSchema)

module.exports = Partner