
import { Router } from "express";

import {
  entrarPacienteNaFila,
  listarMinhaFila,
  cancelarMinhaEntrada,
  listarFilaDoMedico,
  atualizarStatusDaFila,
  listarFilasAdmin
} from "../controllers/filaController.js";

import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas do paciente
router.post("/", autenticarPaciente, entrarPacienteNaFila);
router.get("/me", autenticarPaciente, listarMinhaFila);
router.patch("/:id/cancelar", autenticarPaciente, cancelarMinhaEntrada);

// Rotas do médico
router.get("/medico/me", autenticarMedico, listarFilaDoMedico);
router.patch("/:id/status", autenticarMedico, atualizarStatusDaFila);

// Rotas do administrador
router.get("/", autenticarAdmin, listarFilasAdmin);

export default router;
