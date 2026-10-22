
import { Router } from "express";

import {
  loginAdmin,
  loginMedico
} from "../controllers/authController.js";

import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = Router();

router.post("/admin/login", loginLimiter, loginAdmin);

router.post("/medico/login", loginLimiter, loginMedico);

export default router;
