
import { Router } from "express";

import {
  cadastrarPaciente,
  obterMeuPerfil,
  atualizarMeuPerfil,
  alterarSenhaPaciente,
  obterPacienteParaAtendimento,
  buscarPacientesParaTriagem
} from "../controllers/pacienteController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarEnfermeiro } from "../middlewares/enfermeiroAuthMiddleware.js";
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
router.get(
  "/busca",
  autenticarEnfermeiro,
  buscarPacientesParaTriagem
);

export default router;
