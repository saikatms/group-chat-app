const express = require("express");
const {
  allMessages,
  sendMessage,
  reactOnMessage
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/sendMessage").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.put("/reactOnMessage",protect,reactOnMessage)
module.exports = router;
