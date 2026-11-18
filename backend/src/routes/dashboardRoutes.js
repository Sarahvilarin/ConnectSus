import { Router } from "express";

import {
    obterDashboardAdministrativo,
    obterDashboardEnfermeiro
} from "../controllers/dashboardController.js";

import { autenticarAdmin } from "../middlewares/authMiddleware.js";
import { autenticarEnfermeiro } from "../middlewares/enfermeiroAuthMiddleware.js";

const router = Router();

// Dashboard administrativo.
router.get("/admin", autenticarAdmin, obterDashboardAdministrativo);

// Dashboard do enfermeiro autenticado.
router.get("/enfermeiro/me", autenticarEnfermeiro, obterDashboardEnfermeiro);

export default router;