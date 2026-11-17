
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
  recuperacaoAdminLimiter
} from "../middlewares/loginLimiter.js";

const router = Router();

// Logins sem limite de tentativas
router.post("/admin/login", loginAdmin);
router.post("/medico/login", loginMedico);
router.post("/paciente/login", loginPaciente);

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
