
import { Router } from "express";

import {
  listarUnidades,
  buscarUnidade,
  criarUnidade,
  atualizarUnidade,
  excluirUnidade
} from "../controllers/unidadeController.js";

const router = Router();

// Consultar
router.get("/", listarUnidades);
router.get("/:id", buscarUnidade);

// Cadastrar
router.post("/", criarUnidade);

// Atualizar
router.put("/:id", atualizarUnidade);

// Desativar
router.delete("/:id", excluirUnidade);

export default router;
