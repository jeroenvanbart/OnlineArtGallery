const { Router } = require("express");
const router = Router();

const Review = require("../models/Contact.model");
const Room = require("../models/Art.model");

router.post("/art/:artId/add-contact", (req, res, next) => {
  const { artId } = req.params;
  const { review } = req.body;
  const { user } = req;

  Contact.create({ user: user._id, contact})
    .then((newContact) => {
      Art.findById(artId)
        .then((foundArt) => {
          foundArt.contact.push(newContact._id);

          return foundArt.save();
        })
        .then(() => {
          res.redirect(`/art`);
        })
        .catch((artFindErr) => next(artFindErr));
    })
    .catch((createContactErr) => next(createContactErr));
});

module.exports = router;
