var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Tweet = require("../models/tweets");

const { checkHashtagParam } = require("../modules/checkHashtagParam");

const { extractHashtags } = require("../modules/extractHashtags");

const uid2 = require("uid2");

router.get("/", (req, res) => {
  Tweet.find({}).then((data) => res.json({ result: true, data }));
});

router.get("/hashtag/:hashtag", (req, res) => {
  if (typeof checkHashtagParam(req.params.hashtag) === "string") {
    Tweet.find({ hashtags: { $in: [req.params.hashtag.toLowerCase()] } }) //$in: methode mongo db equivalente à data.filter(e => e.hashtags.includes(req.params...)) sur resultat d'un find all
      .then((data) => res.json({ result: true, data }));
  } else {
    res.json({ result: false });
  }
});

router.post("/", (req, res) => {
  
  const hashtags = extractHashtags(req.body.message)

  // let hashtags = req.body.hashtags;

  if (typeof hashtags === "string") {
    //gere l'erreur si les hashtags ne sont pas envoyés sous forme de tableau
    try {
      hashtags = JSON.parse(hashtags); // si c'était une string JSONifiée
    } catch {
      console.log("body.hashtags doit être un tableau");
      hashtags = [];
    }
  }
  const token = uid2(32);

  const newTweet = new Tweet({
    username: req.body.username,
    firstname : req.body.firstname,
    message: req.body.message,
    hashtags: hashtags,
    heure: new Date(),
    nbrOfLikes: 0,
    token: token
  });

  newTweet.save().then((data) => {
    res.json({ result: true, data :  data});
  });
});

router.get("/trends", (req, res) => {
  let hashtags = [];
  let tweets = 0;
  let tableauObjets = [];
  Tweet.find({})
    .then((data) => {
      hashtags = data.map((e) => e.hashtags);
      //   console.log(hashtags)
      hashtags = hashtags.flat();
      hashtags = [...new Set(hashtags)];
      //   console.log(hashtags);
      return data;
    })
    .then((data) => {
      for (let i = 0; i < hashtags.length; i++) {
        // console.log(hashtags[i])
        for (let j = 0; j < data.length; j++) {
          const hashtagsList = data[j].hashtags;
          console.log(hashtagsList);
          if (hashtagsList.some((e) => e === hashtags[i])) {
            tweets = tweets + 1;
          }
        }
        tableauObjets.push({ hashtag: hashtags[i], nbrTweets: tweets });
        tweets = 0;
      }
      res.json({ result: true, data: tableauObjets });
    });
});


router.delete("/", (req, res) => {
  // console.log("BODY REÇU :", req.body)

  Tweet.findOne({token : req.body.token }).then((tweetToDelete) => {
    console.log(tweetToDelete)
    if (!tweetToDelete) {
      res.json({ result: false });
    } else {
      Tweet.deleteOne({token : req.body.token  })
        .then(() => {
          res.json({ result: true });
        });
    }
  });
});

router.put('/likesupdate', (req, res) => {
  if(req.body.modifyLike === 'true'){
    Tweet.updateOne({token: req.body.token}, { $inc: { nbrOfLikes: +1 } }).then(() => res.json({result : true}))
  } else if (req.body.modifyLike === 'false'){
    Tweet.updateOne({token: req.body.token}, { $inc: { nbrOfLikes: -1 } }).then(() => res.json({result : true}))
  } else { res.json({result : false})}
  
})

module.exports = router;
