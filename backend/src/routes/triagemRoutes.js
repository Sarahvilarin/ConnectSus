
import { Router } from "express";

import {
  criarTriagem,
  listarTriagens,
  buscarTriagem,
  listarTriagensDoPaciente,
  vincularTriagemConsulta
} from "../controllers/triagemController.js";

import { autenticarEnfermeiro } from "../middlewares/enfermeiroAuthMiddleware.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Enfermeiro registra uma triagem
router.post("/", autenticarEnfermeiro, criarTriagem);

// Enfermeiro e administrador consultam triagens
router.get("/", autenticarEnfermeiro, listarTriagens);
router.get("/:id", autenticarEnfermeiro, buscarTriagem);
router.get("/paciente/:pacienteId", autenticarEnfermeiro, listarTriagensDoPaciente);
router.patch("/:id/consulta", autenticarEnfermeiro, vincularTriagemConsulta);

export default router;
