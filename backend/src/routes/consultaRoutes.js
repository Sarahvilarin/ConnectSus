
import { Router } from "express";
import {
  solicitarConsulta,
  listarMinhasConsultas
} from "../controllers/consultaController.js";
import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";

const router = Router();

router.post("/", autenticarPaciente, solicitarConsulta);
router.get("/me", autenticarPaciente, listarMinhasConsultas);

export default router;
