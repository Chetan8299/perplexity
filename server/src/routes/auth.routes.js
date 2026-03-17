import { Router } from "express";
import * as authControllers from "../controllers/auth.controllers.js";
import { loginValidations, registerValidations } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */
authRouter.post("/register", registerValidations, validate, authControllers.register);

/**
 * @route GET /api/auth/verify-email
 * @description Verify email of the user
 * @access Public
 * @query {string} token - The token of the user
 */
authRouter.get("/verify-email", authControllers.verifyEmail);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 */
authRouter.post("/login", loginValidations, validate, authControllers.login);

/**
 * @route GET /api/auth/me
 * @description Get the user's profile
 * @access Private
 * @returns {Object} The user's profile
 */
authRouter.get("/me", authenticate, authControllers.getMe);

export default authRouter;