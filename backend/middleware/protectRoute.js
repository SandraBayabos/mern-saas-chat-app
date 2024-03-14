import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    req.userId = user;

    next(); // call the next function i.e. sendMessage, which is in the message.controller.js
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: `Internal Server Error` });
  }
};

export default protectRoute;
