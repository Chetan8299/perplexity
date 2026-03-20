import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, addNewMessage, createNewChat, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch();

    async function handleSendMessage(message, chatId) {
        try {
            dispatch(setLoading(true));
            const data = await sendMessage(message, chatId);
            const { chat, title, aiMessage } = data;
            if (!chatId) dispatch(createNewChat({ chatId: chat._id, title }))
            dispatch(addNewMessage({ chatId: chatId || chat._id, content: message, role: "user" }))
            dispatch(addNewMessage({ chatId: chatId || chat._id, content: aiMessage.content, role: "assistant" }))
            dispatch(setCurrentChatId(chatId || chat._id));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            const { chats } = await getChats();
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt
                }
                return acc;
            }, {})
            ));
        } catch (error) {
            dispatch(setError(error.message));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            if (chats[chatId]?.messages.length === 0) {
                const { messages } = await getMessages(chatId);
                const formattedMessages = messages.map(message => ({
                    content: message.content,
                    role: message.role,
                }))
                dispatch(addMessages({ chatId, messages: formattedMessages }))
            }
            dispatch(setCurrentChatId(chatId));
        } catch (error) {
            dispatch(setError(error.message));
        }

    }
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}