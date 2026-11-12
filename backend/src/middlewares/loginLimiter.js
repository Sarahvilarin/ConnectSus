
import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    mensagem: "Muitas tentativas de login. Aguarde 15 minutos."
  }
});

// Proteção exclusiva da recuperação de senha do administrador
export const recuperacaoAdminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    mensagem: "Muitas tentativas de recuperação. Aguarde 15 minutos."
  }
});
