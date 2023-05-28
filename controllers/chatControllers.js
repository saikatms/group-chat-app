const asyncHandler = require("express-async-handler");
const { remove } = require("../models/chatModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  // console.log(req);
  // console.log(req.body.name, req.body.users);
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(JSON.stringify(req.body.users));
  // console.log(users);
  // return 

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    // console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
   
  if (req && req.user) {
    const updatedChat = await Chat.findOneAndUpdate(
      {_id : chatId,groupAdmin: req.user._id},
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("chat Not Found or user not permitted to update chat name");
    } else {
      res.json(updatedChat);
    }
  }
  
});

const addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (req && req.user) {
    const added = await Chat.findOneAndUpdate(
      {_id:chatId,groupAdmin:req.user._id},
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("chat Not Found or you are not authorized to add menmber");
    } else {
      res.json(added);
    }
  }
  else{
    return res.send(500).send({"error":"Something went wrong"});
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  console.log("req.user",req.user);
  if (req && req.user) {
    let removed;
    if (req.user._id == userId) {
      console.log("647310015b7039c1559c966c",userId);
      removed = await Chat.findByIdAndUpdate(
        {_id:chatId},
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    }else{
      removed = await Chat.findOneAndUpdate(
        {_id:chatId,groupAdmin:req.user._id},
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    }
    
  
    if (!removed) {
      res.status(404);
      throw new Error("chat Not Found");
    } else {
      res.json(removed);
    }
  }else{
    return res.send(500).send({"error":"Something went wrong"})
  }  
});
module.exports = {
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
