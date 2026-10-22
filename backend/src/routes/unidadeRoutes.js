
import { Router } from "express";

import {
  listarUnidades,
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
router.get("/:id", buscarUnidade);

// Rotas exclusivas para administradores
router.post("/", autenticarAdmin, criarUnidade);
router.put("/:id", autenticarAdmin, atualizarUnidade);
router.delete("/:id", autenticarAdmin, excluirUnidade);
router.get("/:id/especialidades", listarEspecialidadesPorUnidade);

export default router;
