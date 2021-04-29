const express = require("express");
const router = express.Router();

const Art = require("../models/Art.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
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

module.exports = router;
