var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Tweet = require("../models/tweets");

const { checkBody } = require("../modules/checkBody");

const bcrypt = require("bcrypt");
// const hash = bcrypt.hashSync(req.body.password, 10)
// bcrypt.compareSync(req.body.password, data.password) >>> true or false
const uid2 = require("uid2");
// const token = uid2(32);

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password", "firstname"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        password: hash,
        token: token,
        tweetsliked: [],
      });

      newUser.save().then((data) => {
        res.json({
          result: true,
          data: {
            username: data.username,
            firstname: data.firstname,
            token: data.token,
            tweetsliked: data.tweetsliked,
          },
        });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
}); //A VOIR

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({
    username: req.body.username,
  }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        data: {
          token: data.token,
          firstname: data.firstname,
          tweetsliked: data.tweetsliked,
        },
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/showtweetsliked", (req, res) => { 
  User.findOne({ token: req.body.token })
    .populate("tweetsliked")
    .then((data) => res.json({ result: true, data }));
});

router.put("/newtweetliked", (req, res) => {
  const user = req.body.tokenUser;
  const tweet = req.body.tokenTweet;

  let tweetid;
  Tweet.findOne({ token: tweet })
    .then((data) => {
      tweetid = data;
    })
    .then(() =>
      User.updateOne({ token: user }, { $push: { tweetsliked: tweetid.id } })
    )
    .then(() => res.json({ results: true }));
});

router.put("/unlikedtweet", (req, res) => {
  const user = req.body.tokenUser;
  const tweet = req.body.tokenTweet;

  let tweetid;
  Tweet.findOne({ token: tweet })
    .then((data) => {
      tweetid = data;
      console.log(tweetid)
    })
    .then(() =>
      User.updateOne({ token: user }, { $pull: { tweetsliked: tweetid.id } })
    )
    .then(() => res.json({ results: true }));
})

module.exports = router;
