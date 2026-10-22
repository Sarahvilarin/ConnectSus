
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

export async function loginAdmin(req, res, next) {
  try {
    const { email, senha } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha."
      });
    }

    const [administradores] = await pool.query(
      `SELECT id, nome, email, senha_hash
       FROM administradores
       WHERE email = ? AND ativo = TRUE
       LIMIT 1`,
      [email.trim()]
    );

    if (administradores.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const admin = administradores[0];

    const senhaValida = await bcrypt.compare(
      senha,
      admin.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    const token = jwt.sign(
      {
        tipo: "admin"
      },
      process.env.JWT_SECRET,
      {
        subject: String(admin.id),
        expiresIn: "2h",
        algorithm: "HS256"
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      administrador: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email
      }
    });

  } catch (error) {
    next(error);
  }
}


// LOGIN DO MÉDICO
export async function loginMedico(req, res, next) {
  try {
    const { crm, uf_crm, senha } = req.body ?? {};

    if (
      typeof crm !== "string" ||
      !/^\d{1,20}$/.test(crm) ||
      typeof uf_crm !== "string" ||
      !/^[A-Z]{2}$/.test(uf_crm) ||
      typeof senha !== "string" ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Informe CRM, UF e senha válidos."
      });
    }

    // Buscar médico ativo no banco
    const [medicos] = await pool.query(
      `SELECT
        id,
        nome_completo,
        crm,
        uf_crm,
        senha_hash
       FROM medicos
       WHERE crm = ?
         AND uf_crm = ?
         AND ativo = TRUE
       LIMIT 1`,
      [crm, uf_crm]
    );

    if (medicos.length === 0) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas."
      });
    }

    const medico = medicos[0];

    // Comparar senha com o hash
    const senhaValida = await bcrypt.compare(
      senha,
      medico.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    // Criar token JWT exclusivo do médico
    const token = jwt.sign(
      { tipo: "medico" },
      process.env.JWT_SECRET,
      {
        subject: String(medico.id),
        expiresIn: "2h",
        algorithm: "HS256"
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      medico: {
        id: medico.id,
        nome_completo: medico.nome_completo,
        crm: medico.crm,
        uf_crm: medico.uf_crm
      }
    });

  } catch (error) {
    next(error);
  }
}

