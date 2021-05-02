const { Router } = require("express");
const router = Router();
const fileUploader = require("../configs/cloudinary.config");

const Art = require("../models/Art.model");


router.get("/create-art", (req, res) => {
  const { user } = req;
  res.status(200).render("art/create", { user });
});


router.post("/create-art" ,
fileUploader.single("imageUrl"),(req, res, next) => {
  const { title, description, medium, price } = req.body;
  const { _id } = req.user;
  const { path } = req.file;

  Art.create({ title, description, medium, price, owner: _id, imageUrl: path })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((createErr) => next(createErr));
});


router.get("/art/:artId", (req, res, next) => {
  const { artId } = req.params;

  Art.findById(artId)
    .populate("owner")
    .then((artResult) => {
      if (req.user) {
        if (artResult.owner.equals(req.user)) {
          artResult.isOwner = true;
        }}
      res.redirect("/profile");
    })
    .catch((findErr) => next(findErr));
});

router.get("/art/:artId/edit", (req, res, next) => {
  const { artId } = req.params;
  Art.findById(artId)
    .then((artResult) => {
      res.status(200).render("art/edit-art", { artResult, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

router.post("/art/:artId/edit", (req, res, next) => {
  const { artId } = req.params;
  const { title, description } = req.body;

  Art.findByIdAndUpdate(artId, { title, description })
    .then((updatedArt) => {
      res.redirect(`/art/${updatedArt._id}`);
    })
    .catch((findUpdateErr) => next(findUpdateErr));
});

router.post("/art/:artId/delete", (req, res, next) => {
  const { artId } = req.params;
  Art.findByIdAndDelete(artId)
    .then(() => {
      res.redirect("/profile");
    })
    .catch((deleteErr) => {
      next(deleteErr);
    });
});

router.post("/art/:artId/add-rating", (req, res, next) => {
  const { artId } = req.params;
  const { rating } = req.body;
  const { user } = req;
  Art.findByIdAndUpdate(artId, {$push:{rating: rating}})
    .then(() => {
          res.redirect(`/art/${artId}/details`);
    })
    .catch((createContactErr) => next(createContactErr));
});

module.exports = router;
