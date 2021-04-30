const express = require("express");
const router = express.Router();

const Art = require("../models/Art.model");
const User = require("../models/User.model");


router.get("/", (req, res, next) => {
  const user = req.user;
  Art.find({})
  .then((allArtResults) => {
    res.render("index", {allArtResults, user});
  })
  .catch((findErr) => next(findErr));
});


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
      if (req.user) {
        allArtResults.forEach((artItem) => {
          if (artItem.owner.equals(req.user)) {
            artItem.isOwner = true;
          }
        });
      }
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
  .populate("contact")
  .populate({
    path: "contact",
    populate: {
      path: "user",
      model: "User",
    },
  })
    .then((artResults) => {
      res
        .status(200)
        .render("art/details", { artResults, user, contact: artResults.contact });
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

// router.get("/search-art", (req, res, next) =>{
//   res.render("/searchRes")
// })


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
