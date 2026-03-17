import { Router } from "express"
import * as chatController from "../controllers/chat.controller.js"
import { authenticate } from "../middlewares/authenticate.js"

const chatRouter = Router();

/**
 * @route GET /api/chats
 * @description Get all chats
 * @access Private
 * @returns {Object} - The chats
 */
chatRouter.get("/", authenticate, chatController.getChats);

/**
 * @route POST /api/chats/message
 * @description Send a message to the chat
 * @access Private
 * @body {string} message - The message to send
 * @body {string} chatId - The chat ID
 * @returns {Object} - The chat and the message
 */
chatRouter.post("/message", authenticate, chatController.sendMessage);

/**
 * @route GET /api/chats/:chatId
 * @description Get all messages of a chat
 * @access Private
 * @param {string} chatId - The chat ID
 * @returns {Object} - The messages
 */
chatRouter.get("/:chatId", authenticate, chatController.getMessages);

/**
 * @route DELETE /api/chats/:chatId
 * @description Delete a chat
 * @access Private
 * @param {string} chatId - The chat ID
 * @returns {Object} - The message
 */
chatRouter.delete("/:chatId", authenticate, chatController.deleteChat);

export default chatRouter;