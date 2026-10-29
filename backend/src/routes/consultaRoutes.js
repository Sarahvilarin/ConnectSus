
import { Router } from "express";

import {
  solicitarConsulta,
  listarMinhasConsultas,
  cancelarMinhaConsulta,
  confirmarConsulta,
  listarConsultasDoMedico,
  concluirConsulta
} from "../controllers/consultaController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

// Rotas do paciente autenticado
router.post("/", autenticarPaciente, solicitarConsulta);
router.get("/me", autenticarPaciente, listarMinhasConsultas);
router.patch("/:id/cancelar", autenticarPaciente, cancelarMinhaConsulta);

// Rota do médico autenticado
router.patch("/:id/confirmar", autenticarMedico, confirmarConsulta);
router.get("/medico/me", autenticarMedico, listarConsultasDoMedico);
router.patch("/:id/concluir", autenticarMedico, concluirConsulta);

export default router;
