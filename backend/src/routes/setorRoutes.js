
import { Router } from "express";

import {
  listarSetores,
  listarSetoresPorUnidade,
  vincularSetor,
  desvincularSetor
} from "../controllers/setorController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/", listarSetores);
router.get("/unidade/:id", listarSetoresPorUnidade);

// Rotas exclusivas para administradores
router.post(
  "/unidade/:id/:setorId",
  autenticarAdmin,
  vincularSetor
);

router.delete(
  "/unidade/:id/:setorId",
  autenticarAdmin,
  desvincularSetor
);

export default router;
