import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        })
    }

    const user = await userModel.create({ username, email, password });

    await sendEmail(email, "Welcome to perplexity", `
        <h1>Welcome to perplexity</h1>
        <p>Thank you for signing up. Please click the button below to verify your email.</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}">Verify Email</a>
    `)

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
    })
}