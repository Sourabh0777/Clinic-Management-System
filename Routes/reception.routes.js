const express = require("express");
const router = express.Router();
const {
  receptionSignup,
  receptionLogin,
  getReceptionProfile,
  changeProfilePicture,
  getProfilePicture,
} = require("../Controller/Reception/receptionController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsReception } = require("../middleware/verifyIsReception");

router.post("/signup", receptionSignup);
router.post("/login", receptionLogin);

router.use(verifyIsLoggedIn, verifyIsReception);
router.get("/profile", getReceptionProfile);
router.put("/profile/picture", changeProfilePicture);
router.get("/profile/picture/:pictureId", getProfilePicture);

module.exports = router;
