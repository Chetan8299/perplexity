import { Router } from "express";
import { login, register, verifyEmail } from "../controllers/auth.controllers.js";
import { loginValidations, registerValidations } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */
authRouter.post("/register", registerValidations, validate, register);

/**
 * @route GET /api/auth/verify-email
 * @description Verify email of the user
 * @access Public
 * @query {string} token - The token of the user
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */
authRouter.post("/login", loginValidations, validate, login);

export default authRouter;