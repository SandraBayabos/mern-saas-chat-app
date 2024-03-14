import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jtw", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks i.e. cross-site scripting attacks
    sameSite: "strict", // CSRF attacks
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
};

export default generateTokenAndSetCookie;
