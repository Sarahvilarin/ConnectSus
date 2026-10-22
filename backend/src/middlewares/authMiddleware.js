
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

export async function autenticarAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        mensagem: "Token de autenticação não informado."
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        mensagem: "Token de autenticação não informado."
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
      dados.tipo !== "admin" ||
      !/^[1-9]\d*$/.test(dados.sub ?? "")
    ) {
      return res.status(403).json({
        mensagem: "Acesso permitido apenas a administradores."
      });
    }

    const [administradores] = await pool.query(
      `SELECT id, nome, email
       FROM administradores
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [dados.sub]
    );

    if (administradores.length === 0) {
      return res.status(401).json({
        mensagem: "Administrador não encontrado ou desativado."
      });
    }

    req.admin = administradores[0];

    next();
  } catch (error) {
    next(error);
  }
}
