const { Router } = require("express");
const Art = require("../models/Art.model");
const router = Router();

router.get("/profile", (req, res, next) => {
  const { user } = req;
  const artarr = [];
  Art.find({})
    .populate("owner")
    .then((allArtResults) => {
        for (let i= 0; i < allArtResults.length; i++) {
          if (user.equals(allArtResults[i].owner)){
            artarr.push(allArtResults[i])
        }};
        
      res.status(200).render("users/profile", { user, artarr });
    })
    .catch((findErr) => next(findErr));
});

// router.get('/user/:userId', async (req, res) => {
//   try {
//     const art = await Art.find({
//       user: req.params.userId,
//       status: 'public',
//     })
//       .populate('user')
//       .lean()

//     res.render('users/profile', {
//       stories,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })


module.exports = router;
