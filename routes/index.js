const express = require("express");
const router = express.Router();

const Art = require("../models/Art.model");
const User = require("../models/User.model");
const Contact = require("../models/Contact.model")


router.get("/", (req, res, next) => {
  const user = req.user;
  const artistarr =[];
  Art.aggregate([{ $sample: { size: 3 } }])
  .then((allArtResults) => {
    User.aggregate([{ $sample: { size: 10 } }])
    .then((alluserresults) => {
      for (let i=0; i< alluserresults.length; i++){
        if(alluserresults[i].usertype === "artist"){
          artistarr.push(alluserresults[i]) 
        }
      }
      res.render("index", {allArtResults, artistarr, user});
    })
  })
  .catch((findErr) => next(findErr));
  })

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
  let avg =0;
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
      for(let i=0; i<artResults.rating.length; i++){
        avg += artResults.rating[i];
      }
      let calavg = avg/artResults.rating.length;
      let roundednr = Math.round(calavg *1)/1;
      if(roundednr === 1){
        artResults.onestar = true;
      }else if (roundednr === 2){
        artResults.twostar = true;
      }else if (roundednr === 3){
        artResults.treestar = true;
      }else if(roundednr ===  4){
        artResults.fourstar = true;
      }else{
        artResults.fivestar = true;
      }
      res
        .status(200)
        .render("art/details", { artResults, user, contact: artResults.contact, roundednr });
    })
    .catch((findErr) => next(findErr));
});


router.get("/artists", (req, res, next) => {
  const{user} = req;
  const artistArr = [];
  User.find({})
    .then((allUsers) => {
      for(let i=0; i< allUsers.length; i++){
        if (allUsers[i].usertype == "artist"){
        artistArr.push(allUsers[i])
      }}
      res
        .status(200)
        .render("users/artists", {artistArr, user});
    })
    .catch((findErr) => next(findErr));
});

router.get("/:id/details", (req, res, next) => {
  const { id } = req.params;
  const{user} = req;
  const artArr = [];
  const userArr=[];
  Art.find({})
  .populate("owner")
  .then((data) => {
    User.findById(id)
    .then((userdata) => {
      userArr.push(userdata)
    for(let i=0;i<data.length; i++){
      if(id === data[i].owner.id){
      artArr.push(data[i]) 
    }}}).then(()=>{
    res.status(200).render("users/artistdetails", {artArr, userArr, user})
    }
    )
    }).catch((findErr) => next(findErr));
});

router.get("/search-art", 
(req, res, next) => {
  const { user} =req;
  const {search} = req.query;
  const foundArtArr = [];
  Art.find({})
  .populate("owner")
    .then((foundData) => {
          for (let i=0; i<foundData.length; i++){
        if (foundData[i].title.toLowerCase().includes(search.toLowerCase())) {
          foundArtArr.push(foundData[i])
        }
      }
      res.status(200).render("searchRes/searchRes", {foundArtArr, user});
    })
    .catch((findUpdateErr) => next(findUpdateErr))
  });

  router.get("/search-artist", 
(req, res, next) => {
  const {user} =req;
  const {search} = req.query;
  const foundArtArr = [];
  Art.find({})
  .populate("owner")
    .then((foundData) => {
          for (let i=0; i<foundData.length; i++){
        if (foundData[i].owner.fullName.toLowerCase().includes(search.toLowerCase())) {
          foundArtArr.push(foundData[i])
        }
      }
      res.status(200).render("searchRes/searchartist", {foundArtArr, user});
    })
    .catch((findUpdateErr) => next(findUpdateErr))
  });

  router.get("/forgot", 
  (req, res, next) => {
    res.status(200).render("forgot");
  });



module.exports = router;

