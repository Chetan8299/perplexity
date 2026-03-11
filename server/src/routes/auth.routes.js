import { Router } from "express";
import { register } from "../controllers/auth.controllers.js";
import { registerValidations } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.js";

const authRouter = Router();

authRouter.post("/register", registerValidations, validate, register);

export default authRouter;