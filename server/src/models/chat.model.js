import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });

const chatModel = model("chat", chatSchema);

export default chatModel;