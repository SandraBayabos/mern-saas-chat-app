import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.userId._id; // req.userId is coming from protectRoute middleware

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password'); // find all users except the logged in user

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    res.status(500).json({ message: `Internal Server Error` });
  }
};
