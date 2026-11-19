
import express from "express";
import cors from "cors";
import helmet from "helmet";

import unidadeRoutes from "./routes/unidadeRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import especialidadeRoutes from "./routes/especialidadeRoutes.js";
import setorRoutes from "./routes/setorRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import exameRoutes from "./routes/exameRoutes.js";
import filaRoutes from "./routes/filaRoutes.js";
import atendimentoDomiciliarRoutes from "./routes/atendimentoDomiciliarRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import enfermeiroRoutes from "./routes/enfermeiroRoutes.js";
import triagemRoutes from "./routes/triagemRoutes.js";

const app = express();

// Configurações de segurança
app.use(helmet());

const origensPermitidas = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://localhost:3000",
  "http://conectasus.10.189.87.231.sslip.io",
  "https://conectasus.10.189.87.231.sslip.io",
  "http://connectasus.10.189.87.231.sslip.io",
  "https://connectasus.10.189.87.231.sslip.io",
].filter(Boolean);

app.use(cors({
  origin: origensPermitidas
}));

// Permite receber JSON
app.use(express.json());

// Normaliza requisições com /api duplicado (ex: /api/api/...)
app.use((req, res, next) => {
  // if (req.url.startsWith("/api/api/")) {
  req.url = req.url.replace(/^\/api\/api\//, "/api/");
  // }
  next();
});

// Rotas da API
app.use("/api/health", healthRoutes);
app.use("/api/unidades", unidadeRoutes);
app.use("/api/unidades", unidadeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/especialidades", especialidadeRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/enfermeiros", enfermeiroRoutes);
app.use("/api/triagens", triagemRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/exames", exameRoutes);
app.use("/api/filas", filaRoutes);
app.use("/api/atendimentos-domiciliares", atendimentoDomiciliarRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada."
  });
});

// Tratamento de erros
app.use(errorHandler);

export default app;
