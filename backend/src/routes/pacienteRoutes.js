
import { Router } from "express";

import {
  cadastrarPaciente,
  obterMeuPerfil,
  atualizarMeuPerfil,
  alterarSenhaPaciente,
  obterPacienteParaAtendimento
} from "../controllers/pacienteController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

router.post("/", cadastrarPaciente);
router.get("/me", autenticarPaciente, obterMeuPerfil);
router.put("/me", autenticarPaciente, atualizarMeuPerfil);
router.patch("/me/senha", autenticarPaciente, alterarSenhaPaciente);
router.get(
  "/:id/atendimento",
  autenticarMedico,
  obterPacienteParaAtendimento
);

export default router;
