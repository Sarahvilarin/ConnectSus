
import { Router } from "express";

import {
  criarEnfermeiro,
  listarEnfermeiros,
  buscarEnfermeiro,
  atualizarEnfermeiro,
  excluirEnfermeiro,
  reativarEnfermeiro,
  meuPerfilEnfermeiro
} from "../controllers/enfermeiroController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";
import { autenticarEnfermeiro } from "../middlewares/enfermeiroAuthMiddleware.js";

const router = Router();

router.get("/me", autenticarEnfermeiro, meuPerfilEnfermeiro);

// Rotas exclusivas dos administradores
router.use(autenticarAdmin);

router.get("/", listarEnfermeiros);
router.get("/:id", buscarEnfermeiro);
router.post("/", criarEnfermeiro);
router.put("/:id", atualizarEnfermeiro);
router.delete("/:id", excluirEnfermeiro);
router.patch("/:id/reativar", reativarEnfermeiro);

export default router;
