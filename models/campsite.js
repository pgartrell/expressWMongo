//Defining mongoose Schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema //Shorthand so we only have to refer to it as Schema

require('mongoose-currency').loadType(mongoose)//loads new currency type into mongoose so it is available in mongoose schema
const Currency = mongoose.Types.Currency;

//Used for documents storing comments about a campsite
const commentSchema = new Schema ({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    } 
    }   , {
            timestamps: true
})

//first argument is required. An object that contains a definition for the Schema via the objects properties
//Second argument is optional, setting optional configurations
const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //no two documents should have the same name field
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    elevation: {
        type: Number, 
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured : {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] //causes every campsite document to contain multiple comments documents stored within an array
}, {
    timestamps: true //Cause mongoose to automatically add two properties: createdAt and updatedAt property.

})

//Creates a model named campsite. We are using this for the collection called campsites
//mongoose looks for the lowercase plural version of campsite
//This will return a constructor function
const Campsite = mongoose.model('Campsite', campsiteSchema)

module.exports = Campsite