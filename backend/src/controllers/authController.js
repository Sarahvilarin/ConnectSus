
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
    const { crm, coren, uf_crm, uf_coren, senha } = req.body ?? {};

    if (
      typeof senha !== "string" ||
      !senha ||
      typeof (crm ?? coren) !== "string" ||
      !/^\d{1,20}$/.test(crm ?? coren) ||
      typeof (uf_crm ?? uf_coren) !== "string" ||
      !/^[A-Z]{2}$/.test(uf_crm ?? uf_coren)
    ) {
      return res.status(400).json({
        mensagem: "Informe CRM ou COREN, UF e senha válidos."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    const identificador = crm ?? coren;
    const uf = uf_crm ?? uf_coren;
    const ehMedico = typeof crm === "string";

    let profissional;
    let tipo;

    if (ehMedico) {
      const [medicos] = await pool.query(
        `SELECT id, nome_completo, crm, uf_crm, senha_hash
         FROM medicos
         WHERE crm = ? AND uf_crm = ? AND ativo = TRUE
         LIMIT 1`,
        [identificador, uf]
      );

      profissional = medicos[0];
      tipo = "medico";
    } else {
      const [enfermeiros] = await pool.query(
        `SELECT id, nome_completo, coren, uf_coren, senha_hash
         FROM enfermeiros
         WHERE coren = ? AND uf_coren = ? AND ativo = TRUE
         LIMIT 1`,
        [identificador, uf]
      );

      profissional = enfermeiros[0];
      tipo = "enfermeiro";
    }

    if (!profissional) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas."
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      profissional.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas."
      });
    }

    const token = jwt.sign(
      { tipo },
      process.env.JWT_SECRET,
      {
        subject: String(profissional.id),
        expiresIn: "2h",
        algorithm: "HS256"
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      tipo,
      profissional: ehMedico
        ? {
            id: profissional.id,
            nome_completo: profissional.nome_completo,
            crm: profissional.crm,
            uf_crm: profissional.uf_crm
          }
        : {
            id: profissional.id,
            nome_completo: profissional.nome_completo,
            coren: profissional.coren,
            uf_coren: profissional.uf_coren
          }
    });
  } catch (error) {
    next(error);
  }
}



export async function loginPaciente(req, res, next) {
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

    const emailLimpo = email.trim().toLowerCase();

    const [pacientes] = await pool.query(
      `SELECT id, nome_completo, cpf, email, senha_hash
       FROM pacientes
       WHERE email = ? AND ativo = TRUE
       LIMIT 1`,
      [emailLimpo]
    );

    if (pacientes.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const paciente = pacientes[0];

    const senhaValida = await bcrypt.compare(
      senha,
      paciente.senha_hash
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
      { tipo: "paciente" },
      process.env.JWT_SECRET,
      {
        subject: String(paciente.id),
        expiresIn: "2h",
        algorithm: "HS256"
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      paciente: {
        id: paciente.id,
        nome_completo: paciente.nome_completo,
        cpf: paciente.cpf,
        email: paciente.email
      }
    });
  } catch (error) {
    next(error);
  }
}

