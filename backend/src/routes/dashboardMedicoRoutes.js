import { Router } from "express";

import {
    obterDashboardMedico
} from "../controllers/dashboardMedicoController.js";

import { autenticarMedico } from "../middlewares/medicoAuthMiddleware.js";

const router = Router();

router.get("/", autenticarMedico, obterDashboardMedico);

export default router;