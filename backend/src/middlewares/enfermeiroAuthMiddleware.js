
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

export async function autenticarEnfermeiro(req, res, next) {
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
      dados.tipo !== "enfermeiro" ||
      !/^[1-9]\d*$/.test(dados.sub ?? "")
    ) {
      return res.status(403).json({
        mensagem: "Acesso permitido apenas a enfermeiros."
      });
    }

    const [enfermeiros] = await pool.query(
      `SELECT id, nome_completo, coren, uf_coren
       FROM enfermeiros
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [dados.sub]
    );

    if (enfermeiros.length === 0) {
      return res.status(401).json({
        mensagem: "Enfermeiro não encontrado ou desativado."
      });
    }

    req.enfermeiro = enfermeiros[0];

    next();
  } catch (error) {
    next(error);
  }
}
