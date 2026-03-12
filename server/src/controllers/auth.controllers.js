import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

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

    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    await sendEmail(email, "Welcome to perplexity", `
        <h1>Welcome to perplexity</h1>
        <p>Thank you for signing up. Please click the button below to verify your email.</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${verificationToken}">Verify Email</a>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Thank you for using perplexity.</p>
        <p>Perplexity Team</p>
    `)

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
    })
}


export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid token",
        })
    }

    if (user.verified) {
        return res.status(400).json({
            success: false,
            message: "Email already verified",
        })
    }

    user.verified = true;

    await user.save();

    res.send(`
        <h1>Email Verified</h1>
        <p>Your email has been verified successfully.</p>
        you can now login to your account.
        <a href="http://localhost:3000/login">Login</a>
    `, "text/html")
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
        })
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            verified: user.verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    })
}