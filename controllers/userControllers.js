const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const jwt = require("jsonwebtoken");


// signup new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact } = req.body;

  if (!name || !email || !password || !contact) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });
  const contactExists = await User.findOne({ contact });
  if (userExists) {
    return res.status(400).json({
      message: "Your E-Mail Id is already Registered",
      success: false,
    });
  }
  if (contactExists) {
    return res.status(400).json({
      message: "Your Mobile is already Registered",
      success: false,
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    contact,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, "30d"),
      success: true,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});



// sign in user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "Invalid Credentials OR User not found",
      success: false,
    });
  }
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: "Login Successfull",
      success: true,
    });
  } else {
    return res.status(404).json({
      message: "Invalid Credentials OR User not found",
      success: false,
    });
  }
});

// Search user
const allUsers = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    return res.status(401).json({
      message: "Unathorize Access",
      success: false,
    });
  }
});

// get my self
const getmyself = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.user;
    return res.status(200).json({ user: { userDetails } });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});


module.exports = {
  registerUser,
  authUser,
  allUsers,
  getmyself
};
