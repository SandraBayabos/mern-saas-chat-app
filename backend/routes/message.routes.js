import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // get all messages between the logged in user and the user with the id
router.post("/send/:id", protectRoute, sendMessage); // protectRoute is a middleware -> check if the user is logged in

export default router;
