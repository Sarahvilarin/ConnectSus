
import { Router } from "express";

import {
  criarMedico,
  listarMedicos,
  buscarMedico,
  atualizarMedico,
  excluirMedico,
  reativarMedico,
  meuPerfilMedico,
  atualizarMeuPerfilMedico
} from "../controllers/medicoController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";
import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

// Rota exclusiva do médico autenticado
router.get("/me", autenticarMedico, meuPerfilMedico);

// Rotas exclusivas dos administradores
router.use(autenticarAdmin);

router.get("/", listarMedicos);
router.get("/:id", buscarMedico);
router.post("/", criarMedico);
router.put("/:id", atualizarMedico);
router.delete("/:id", excluirMedico);
router.patch("/:id/reativar", reativarMedico);
router.put("/me", autenticarMedico, atualizarMeuPerfilMedico);

export default router;