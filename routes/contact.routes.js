const { Router } = require("express");
const router = Router();

const Contact = require("../models/Contact.model");
const Art = require("../models/Art.model");
const nodemailer = require('nodemailer')

router.post("/art/:artId/add-contact", (req, res, next) => {
  const { artId } = req.params;
  const { contact } = req.body;
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

router.get("/:artid/contact", (req, res, next) => {
  const {artid} = req.params
  Art.findById(artid)
  .populate("owner")
  .then((data) => {
    console.log(data.owner.email)
    res.render("contact/contact", {data})
  })
  .catch(error => console.log(error));
  
})

router.post('/send-email', (req, res, next) => {
  let {user} = req;
  console.log(user.email)
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PSWRD
    }
  });
  transporter.sendMail({
    from: '"My Artwall" <myawesome@project.com>',
    to: email, 
    subject: `${user.email} sent you an email`, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.status(200).render('contact/message', {email, subject, message, info}))
  .catch(error => console.log(error));
});

module.exports = router;
