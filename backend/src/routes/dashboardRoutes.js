import { Router } from "express";
import {
    obterDashboardAdministrativo
} from "../controllers/dashboardController.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/admin", autenticarAdmin, obterDashboardAdministrativo);

export default router;