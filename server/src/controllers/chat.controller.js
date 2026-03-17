import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"

export const sendMessage = async (req, res) => {
    const { message, chat: chatId } = req.body;

    let title, chat;
    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.userId,
            title
        })
    }

    chatId = chatId || chat._id;

    await messageModel.create({
        chatId: chatId,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    const result = await generateResponse(messages);


    const aiMessage = await messageModel.create({
        chatId: chatId,
        content: result,
        role: "assistant"
    })

    res.status(201).json({
        title,
        chat,
        aiMessage
    })
}

export const getChats = async (req, res) => {
    const chats = await chatModel.find({ user: req.user.userId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Chats fetched successfully",
        chats
    })
}

export const getMessages = async (req, res) => {
    const isUserChat = await chatModel.findOne({ user: req.user.userId, _id: req.params.chatId });

    if (!isUserChat) {
        return res.status(400).json({
            success: false,
            message: "Chat not found",
        })
    }

    const messages = await messageModel.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        messages
    })
}

export const deleteChat = async (req, res) => {
    const isUserChat = await chatModel.findOne({ user: req.user.userId, _id: req.params.chatId });

    if (!isUserChat) {
        return res.status(400).json({
            success: false,
            message: "Chat not found",
        })
    }

    await chatModel.deleteOne({ _id: req.params.chatId });

    await messageModel.deleteMany({ chatId: req.params.chatId });

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
    })
}