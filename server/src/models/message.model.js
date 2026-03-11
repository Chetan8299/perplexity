import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
}, { timestamps: true });

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });

const messageModel = model("Message", messageSchema);

export default messageModel;