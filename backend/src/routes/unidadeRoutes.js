
import { Router } from "express";

import {
  listarUnidades,
  listarEstimativasEsperaUnidades,
  buscarUnidade,
  criarUnidade,
  atualizarUnidade,
  excluirUnidade,
  listarEspecialidadesPorUnidade
} from "../controllers/unidadeController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/", listarUnidades);

// Rotas específicas devem vir antes das rotas com :id
router.get("/estimativas-espera", listarEstimativasEsperaUnidades);
router.get("/:id/especialidades", listarEspecialidadesPorUnidade);
router.get("/:id", buscarUnidade);

// Rotas exclusivas para administradores
router.post("/", autenticarAdmin, criarUnidade);
router.put("/:id", autenticarAdmin, atualizarUnidade);
router.delete("/:id", autenticarAdmin, excluirUnidade);

export default router;
