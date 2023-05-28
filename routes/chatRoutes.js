const express = require("express");
const {
  createGroupChat,
  renameGroup,
  removeUserFromGroup,
  addUserToGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.route("/createGroup").post(protect, createGroupChat);
router.route("/renameGroup").put(protect,renameGroup);
router.route("/removeUserFromGroup").put(protect,removeUserFromGroup);
router.route("/addUserToGroup").put(protect,addUserToGroup);

module.exports = router;
