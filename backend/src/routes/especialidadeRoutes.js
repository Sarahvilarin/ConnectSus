
import { Router } from "express";

import {
  listarEspecialidades,
  buscarEspecialidade,
  criarEspecialidade,
  atualizarEspecialidade
} from "../controllers/especialidadeController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/", listarEspecialidades);
router.get("/:id", buscarEspecialidade);

// Rotas administrativas
router.post("/", autenticarAdmin, criarEspecialidade);
router.put("/:id", autenticarAdmin, atualizarEspecialidade);

export default router;
