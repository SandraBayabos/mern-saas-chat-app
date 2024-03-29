import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId._id; // coming from protectRoute middleware

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // SOCKET IO FUNCTIONALITY WILL GO HERE

    // await newMessage.save();
    // await conversation.save();

    // this is an example of how we can use Promise.all to run multiple async functions
    await Promise.all([newMessage.save(), conversation.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in message controller", error.message);
    res.status(500).json({ message: `Internal Server Error` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.userId._id; // coming from protectRoute middleware

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // not reference but actual messages

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;

    res.status(200).json(messages);

    
  } catch (error) {
    console.log("Error in message controller", error.message);
    res.status(500).json({ message: `Internal Server Error` });
  }
};
