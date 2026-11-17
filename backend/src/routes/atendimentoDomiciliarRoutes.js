import { Router } from "express";
import {
  solicitar,
  listarDoPaciente,
  cancelar,
  listarTodasAdmin,
  buscarPorIdAdmin,
  listarEnfermeirosAdmin,
  agendarAdmin,
  atualizarStatusAdmin,
  listarDoEnfermeiro,
  atualizarStatusEnfermeiro,
} from "../controllers/atendimentoDomiciliarController.js";
import { autenticarPaciente } from "../middlewares/pacienteAuthMiddleware.js";
import { autenticarAdmin } from "../middlewares/authMiddleware.js";
import { autenticarEnfermeiro } from "../middlewares/enfermeiroAuthMiddleware.js";

const router = Router();

// Solicitação e histórico do próprio paciente.
router.post("/", autenticarPaciente, solicitar);
router.get("/paciente/me", autenticarPaciente, listarDoPaciente);
router.patch("/:id/cancelar", autenticarPaciente, cancelar);

// Gestão geral: somente administradores.
router.get("/admin", autenticarAdmin, listarTodasAdmin);
router.get("/admin/enfermeiros", autenticarAdmin, listarEnfermeirosAdmin);
router.get("/admin/:id", autenticarAdmin, buscarPorIdAdmin);
router.patch("/admin/:id/agendar", autenticarAdmin, agendarAdmin);
router.patch("/admin/:id/status", autenticarAdmin, atualizarStatusAdmin);

// Área do enfermeiro: o ID vem exclusivamente do token autenticado.
router.get("/enfermeiro/me", autenticarEnfermeiro, listarDoEnfermeiro);
router.patch("/enfermeiro/:id/status", autenticarEnfermeiro, atualizarStatusEnfermeiro);

// Não há rotas de gestão para médicos.

export default router;
