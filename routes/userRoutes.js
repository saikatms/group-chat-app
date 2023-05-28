const { Router } = require("express");
const express = require("express");
// const upload = require("../utils/multer");
const multer = require("multer");
const {
  registerUser,
  authUser,
  allUsers
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect,allUsers);
// router.route("/getUser").get(protect, getmyself);
router.route("/login").post(authUser);
module.exports = router;
