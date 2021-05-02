const { Router } = require("express");
const Art = require("../models/Art.model");
const User = require("../models/User.model");
const router = Router();
const fileUploader = require("../configs/cloudinary.config");

router.get("/profile", (req, res, next) => {
  const { user } = req;
  const artarr = [];
  Art.find({})
    .populate("owner")
    .then((allArtResults) => {
        for (let i= 0; i < allArtResults.length; i++) {
          if (user.equals(allArtResults[i].owner)){
            artarr.push(allArtResults[i])
        }
      }; 
      if(user.usertype === "artist"){user.isartist = true}
      res.status(200).render("users/profile", { user, artarr, allArtResults });
    })
    .catch((findErr) => next(findErr));
});

router.get("/users/:userId/edit-profile", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(200).render("users/edit-profile", { user });
    })
    .catch((findErr) => next(findErr));
});

router.post("/users/:userId/edit-profile", 
(req, res, next) => {
  const { userId } = req.params;
  const { fullName, bio } = req.body;
  
  User.findByIdAndUpdate(userId, { fullName, bio })
    .then(() => {
      res.redirect(`/profile`);
    })
    .catch((findUpdateErr) => next(findUpdateErr));
});

router.get("/users/:userId/edit-profile-picture",  (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(200).render("users/edit-profile-picture", { user });
    })
    .catch((findErr) => next(findErr));
});

router.post("/users/:userId/edit-profile-picture", fileUploader.single("profileImgUrl"),
(req, res, next) => {
  const { userId } = req.params;
  const { path } = req.file;
  
  User.findByIdAndUpdate(userId, { profileImgUrl: path })
    .then(() => {
      res.redirect(`/profile`);
    })
    .catch((findUpdateErr) => next(findUpdateErr));
});


module.exports = router;
