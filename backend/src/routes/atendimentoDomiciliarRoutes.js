import { Router } from "express";

import {
    solicitar,
    listarDoPaciente,
    buscarPorId,
    listarDaUnidade,
    agendar,
    atualizarStatus,
    cancelar
} from "../controllers/atendimentoDomiciliarController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

// Rotas do paciente
router.post("/", autenticarPaciente, solicitar);
router.get("/paciente/me", autenticarPaciente, listarDoPaciente);
router.patch("/:id/cancelar", autenticarPaciente, cancelar);

// Rotas da equipe médica
router.get("/unidade", autenticarMedico, listarDaUnidade);
router.get("/:id", autenticarMedico, buscarPorId);
router.patch("/:id/agendar", autenticarMedico, agendar);
router.patch("/:id/status", autenticarMedico, atualizarStatus);

export default router;