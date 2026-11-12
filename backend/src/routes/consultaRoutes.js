import { Router } from "express";

import {
  solicitarConsulta,
  listarMinhasConsultas,
  cancelarMinhaConsulta,
  confirmarConsulta,
  listarConsultasDoMedico,
  concluirConsulta,
  buscarTriagemDaConsulta,
  listarDisponibilidadeConsultas
} from "../controllers/consultaController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

// Rotas do paciente autenticado
router.get(
  "/disponibilidade",
  autenticarPaciente,
  listarDisponibilidadeConsultas
);

router.get("/me", autenticarPaciente, listarMinhasConsultas);
router.post("/", autenticarPaciente, solicitarConsulta);
router.patch("/:id/cancelar", autenticarPaciente, cancelarMinhaConsulta);

// Rotas do médico autenticado
router.get("/medico/me", autenticarMedico, listarConsultasDoMedico);
router.patch("/:id/confirmar", autenticarMedico, confirmarConsulta);
router.patch("/:id/concluir", autenticarMedico, concluirConsulta);
router.get("/:id/triagem", autenticarMedico, buscarTriagemDaConsulta);

export default router;