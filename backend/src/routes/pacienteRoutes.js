
import { Router } from "express";

import {
  cadastrarPaciente,
  obterMeuPerfil,
  atualizarMeuPerfil,
  alterarSenhaPaciente
} from "../controllers/pacienteController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";

const router = Router();

router.post("/", cadastrarPaciente);
router.get("/me", autenticarPaciente, obterMeuPerfil);
router.put("/me", autenticarPaciente, atualizarMeuPerfil);
router.patch("/me/senha", autenticarPaciente, alterarSenhaPaciente);

export default router;
