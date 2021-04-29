const { Router } = require("express");
const router = Router();
const fileUploader = require("../configs/cloudinary.config");

const Art = require("../models/Art.model");

/* 
  GET - Create Room Form 
*/
router.get("/create-art", (req, res) => {
  const { user } = req;
  res.status(200).render("art/create", { user });
});

/* 
  POST - Save Form Data to Db
*/
router.post("/create-art" ,
fileUploader.single("imageUrl"),(req, res, next) => {
  const { title, description } = req.body;
  const { _id } = req.user;
  const { path } = req.file;

  Art.create({ title, description, owner: _id, imageUrl: path })
    .then(() => {
      res.redirect("/art");
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
      res.status(200).render("art/details", { artResult, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

router.get("/art/:artId/edit", (req, res, next) => {
  const { artId } = req.params;
  Art.findById(artId)
    .then((roomResult) => {
      res.status(200).render("art/edit-art", { artResult, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

router.post("/art/:artId/edit", (req, res, next) => {
  const { artId } = req.params;
  const { name, description } = req.body;

  Art.findByIdAndUpdate(artId, { name, description })
    .then((updatedArt) => {
      res.redirect(`/art/${updatedArt._id}`);
    })
    .catch((findUpdateErr) => next(findUpdateErr));
});

router.post("/art/:artId/delete", (req, res, next) => {
  const { artId } = req.params;
  Art.findByIdAndDelete(artId)
    .then(() => {
      res.redirect("/art");
    })
    .catch((deleteErr) => {
      next(deleteErr);
    });
});

module.exports = router;
