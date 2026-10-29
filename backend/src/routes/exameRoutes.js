
import { Router } from "express";

import {
  solicitarExame,
  listarMeusExames,
  listarExamesDoMedico,
  listarExames,
  atualizarStatusExame,
  registrarResultadoExame,
  buscarExame
} from "../controllers/exameController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas do paciente autenticado
router.post("/", autenticarPaciente, solicitarExame);
router.get("/me", autenticarPaciente, listarMeusExames);

// Rotas do médico autenticado
router.get("/medico/me", autenticarMedico, listarExamesDoMedico);
router.patch("/:id/status", autenticarMedico, atualizarStatusExame);
router.patch("/:id/resultado", autenticarMedico, registrarResultadoExame);

// Rotas administrativas
router.get("/", autenticarAdmin, listarExames);
router.get("/:id", autenticarAdmin, buscarExame);

export default router;
