import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run
    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePicture:
        gender === "male" ? boyProfilePicture : girlProfilePicture,
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.fullName,
      profilePicture: newUser.profilePicture,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: `${error.message}` });
  }
};

export const login = (req, res) => {
  console.log("Login user");
};

export const logout = (req, res) => {
  console.log("Logout user");
};
