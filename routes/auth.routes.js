const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();
const fileUploader = require("../configs/cloudinary.config");

const User = require("../models/User.model");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup",
  fileUploader.single("profileImgUrl"), 
  (req, res, next) => {
  const { fullName, email, password, bio , usertype} = req.body;
  const { path } = req.file;
    const passwordRegexFormat = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const emailRegexFormat = /^\S+@\S+\.\S+$/;

  if (!fullName || !email || !password || !bio) {
    res
      .status(400)
      .render("auth/signup", { errorMessage: "Form cannot be empty!" });
    return;
  }
    if (!passwordRegexFormat.test(password)) {
      res.status(200).render("auth/signup", {
        errorMessage:
          "Your password should include 6 digits, uppercase and lowercase!",
      });
      return;
    }

    if (!emailRegexFormat.test(email)) {
      res.status(200).render("auth/signup", {
        errorMessage: "Your email is not in the right format",
      });
      return;
    }


  User.findOne({ email })
    .then((userResult) => {
      if (userResult) {
        res.status(400).render("auth/signup", {
          errorMessage: "Email already exists",
        });
        return;
      }
      bcrypt
        .hash(password, 10)
        .then((passwordHash) => {
          return User.create({
              email,
              passwordHash,
              fullName,
              bio,
              usertype: usertype,
              profileImgUrl: path,
            });
          })
        .then((newUser) => {
          req.login(newUser, (err) => {
            if (err) {
              res.status(500).render("auth/signup", {
                errorMessage: "Login failed after signup",
              });
              return;
            }
            res.redirect("/profile");
          });
        })
        .catch((hashErr) => next(hashErr));
    })
    .catch((findErr) => next(findErr));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
