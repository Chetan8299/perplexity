import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Routes
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";


app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;