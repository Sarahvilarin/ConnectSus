
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

export async function autenticarMedico(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (
      typeof authorization !== "string" ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        mensagem: "Token de autenticação não informado."
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        mensagem: "Token não informado."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    let dados;

    try {
      dados = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"]
      });
    } catch {
      return res.status(401).json({
        mensagem: "Token inválido ou expirado."
      });
    }

    if (
      typeof dados !== "object" ||
      dados.tipo !== "medico" ||
      !/^[1-9]\d*$/.test(dados.sub ?? "")
    ) {
      return res.status(403).json({
        mensagem: "Acesso permitido apenas a médicos."
      });
    }

    // Verificar se o médico continua ativo
    const [medicos] = await pool.query(
      `SELECT id, nome_completo, crm, uf_crm
       FROM medicos
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [dados.sub]
    );

    if (medicos.length === 0) {
      return res.status(401).json({
        mensagem: "Médico não encontrado ou desativado."
      });
    }

    req.medico = medicos[0];

    next();

  } catch (error) {
    next(error);
  }
}
