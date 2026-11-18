import { Router } from "express";
import {
  solicitarConsulta,
  listarMinhasConsultas,
  cancelarMinhaConsulta,
  confirmarConsulta,
  listarConsultasDoMedico,
  concluirConsulta,
  buscarTriagemDaConsulta,
  iniciarConsulta,
  registrarFaltaConsulta,
  buscarProntuarioConsulta,
  salvarProntuarioConsulta,
  listarHistoricoProntuariosPaciente,
  listarDisponibilidadeConsultas,
  listarTodasConsultasAdmin
} from "../controllers/consultaController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/disponibilidade",
  autenticarPaciente,
  listarDisponibilidadeConsultas
);

router.post("/", autenticarPaciente, solicitarConsulta);
router.get("/me", autenticarPaciente, listarMinhasConsultas);
router.patch("/:id/cancelar", autenticarPaciente, cancelarMinhaConsulta);

router.get("/medico/me", autenticarMedico, listarConsultasDoMedico);
router.get(
  "/medico/paciente/:pacienteId/historico",
  autenticarMedico,
  listarHistoricoProntuariosPaciente
);

router.patch("/:id/confirmar", autenticarMedico, confirmarConsulta);
router.patch("/:id/iniciar", autenticarMedico, iniciarConsulta);
router.patch("/:id/falta", autenticarMedico, registrarFaltaConsulta);
router.get("/:id/triagem", autenticarMedico, buscarTriagemDaConsulta);
router.get("/:id/prontuario", autenticarMedico, buscarProntuarioConsulta);
router.put("/:id/prontuario", autenticarMedico, salvarProntuarioConsulta);
router.patch("/:id/concluir", autenticarMedico, concluirConsulta);
router.get("/admin", autenticarAdmin, listarTodasConsultasAdmin);

export default router;