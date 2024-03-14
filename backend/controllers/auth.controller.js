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

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      message: "You've logged in!",
    });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: `${error.message}` });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0, path: "/", // Specify the path where the cookie is valid
    domain: "/", // Specify the domain where the cookie is valid
    httpOnly: true, // Ensure that the cookie is only accessible via HTTP(S)
    secure: true, // Ensure that the cookie is only sent over HTTPS
    sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: `${error.message}` });
  }
};
