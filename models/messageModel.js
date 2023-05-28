const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    reacts : {type : mongoose.Schema.Types.Array, ref:"Users"}
  },
  {
    timestamps: true,
    versionKey:false
  }
);

const Message = mongoose.model("Message", messageModel,"Message");

module.exports = Message;
