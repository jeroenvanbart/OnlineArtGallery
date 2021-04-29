const express = require("express");
const router = express.Router();

const Art = require("../models/Art.model");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Art.find({})
  .then((allArtResults) => {
    res.render("index", {allArtResults});
  })
  .catch((findErr) => next(findErr));
});

/* 
  GET - All rooms *** This route should be accessible by everyone
*/
router.get("/art", (req, res, next) => {
  Art.find({})
    .populate("owner contact")
    .populate({
      path: "contact",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .then((allArtResults) => {
      // Check if there is a user loggedIn
      if (req.user) {
        allArtResults.forEach((artItem) => {
          // Check the owners of the room
          if (artItem.owner.equals(req.user)) {
            // if the room is of the loggedInUser --> mark it as isOwner
            artItem.isOwner = true;
          }
        });
      }
      // render the page with all the rooms + marked rooms
      res
        .status(200)
        .render("art/all-art", { art: allArtResults, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

router.get("/art/:id/details", (req, res, next) => {
  const { user} = req;
  const{ id } = req.params;
  Art.findById(id)
    .then((artResults) => {
      res
        .status(200)
        .render("art/details", { artResults, user });
    })
    .catch((findErr) => next(findErr));
});


router.get("/artists", (req, res, next) => {
  const artistArr = [];
  User.find({})
    .then((allUsers) => {
      for(let i=0; i< allUsers.length; i++){
        if (allUsers[i].usertype == "artist"){
        artistArr.push(allUsers[i])
      }}
      res
        .status(200)
        .render("users/artists", {artistArr});
    })
    .catch((findErr) => next(findErr));
});

router.get("/search-art", (req, res, next) =>{
  res.render("/searchRes")
})


// router.post("/search-art", 
// (req, res, next) => {
//   console.log(req.body)
//   Art.find({title: { $regex: "s", $options: "i" }
//     .then((foundData) => {
//       res.render("/searchRes", {foundData});
//     })
//     .catch((findUpdateErr) => next(findUpdateErr))
// });


module.exports = router;
