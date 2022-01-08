//Defining mongoose Schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema; //Shorthand so we only have to refer to it as Schema

//Used for documents storing comments about a campsite
const favoriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    campsites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campsite",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
