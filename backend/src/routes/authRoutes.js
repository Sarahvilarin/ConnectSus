
import { Router } from "express";

import {
  loginAdmin,
  loginMedico,
  loginPaciente,
  solicitarRecuperacaoAdmin,
  verificarCodigoAdmin,
  redefinirSenhaAdmin
} from "../controllers/authController.js";

import {
  loginLimiter,
  recuperacaoAdminLimiter
} from "../middlewares/loginLimiter.js";

const router = Router();

// Logins
router.post("/admin/login", loginLimiter, loginAdmin);
router.post("/medico/login", loginLimiter, loginMedico);
router.post("/paciente/login", loginLimiter, loginPaciente);

// Recuperação de senha exclusiva do administrador
router.post(
  "/admin/recuperar-senha",
  recuperacaoAdminLimiter,
  solicitarRecuperacaoAdmin
);

router.post(
  "/admin/verificar-codigo",
  recuperacaoAdminLimiter,
  verificarCodigoAdmin
);

router.post(
  "/admin/redefinir-senha",
  recuperacaoAdminLimiter,
  redefinirSenhaAdmin
);

export default router;
