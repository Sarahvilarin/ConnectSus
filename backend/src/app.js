
import express from "express";
import cors from "cors";
import helmet from "helmet";

import unidadeRoutes from "./routes/unidadeRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Configurações de segurança
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

// Permite receber JSON
app.use(express.json());

// Rotas da API
app.use("/api/health", healthRoutes);
app.use("/api/unidades", unidadeRoutes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada."
  });
});

// Tratamento de erros
app.use(errorHandler);

export default app;
