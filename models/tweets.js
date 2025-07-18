const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  username: String,
  firstname: String,
  message: String,
  hashtags: [String],
  heure: Date,
  nbrOfLikes: Number,
  token: String
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
