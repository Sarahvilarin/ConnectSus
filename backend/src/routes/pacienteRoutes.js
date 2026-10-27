import { Router } from "express";
import { cadastrarPaciente } from "../controllers/pacienteController.js";

const router = Router();

router.post("/", cadastrarPaciente);

export default router;