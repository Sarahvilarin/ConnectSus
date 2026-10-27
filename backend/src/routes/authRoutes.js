
import { Router } from "express";

import {
  loginAdmin,
  loginMedico,
  loginPaciente
} from "../controllers/authController.js";

import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = Router();

router.post("/admin/login", loginLimiter, loginAdmin);

router.post("/medico/login", loginLimiter, loginMedico);

router.post("/paciente/login", loginLimiter, loginPaciente);

export default router;
