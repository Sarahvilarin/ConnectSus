
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
import { pool } from "../config/database.js";
import { enviarCodigoRecuperacao } from "../services/emailService.js";


// LOGIN DO ADMINISTRADOR

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
      { tipo: "admin" },
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


// LOGIN DO PACIENTE

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


// RECUPERAÇÃO DE SENHA DO ADMINISTRADOR

// 1. Solicitar código de recuperação

export async function solicitarRecuperacaoAdmin(req, res, next) {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido."
      });
    }

    const emailLimpo = email.trim().toLowerCase();

    const [administradores] = await pool.query(
      `SELECT id, email
       FROM administradores
       WHERE LOWER(email) = ? AND ativo = TRUE
       LIMIT 1`,
      [emailLimpo]
    );

    // Não revela se o e-mail está cadastrado.
    if (administradores.length === 0) {
      return res.status(200).json({
        mensagem: "Se o e-mail estiver cadastrado, você receberá um código de recuperação."
      });
    }

    const admin = administradores[0];

    // Gera um código numérico de seis dígitos.
    const codigo = String(randomInt(0, 1000000)).padStart(6, "0");

    // Armazena somente o hash do código.
    const codigoHash = await bcrypt.hash(codigo, 10);

    // Invalida códigos anteriores ainda não utilizados.
    await pool.query(
      `UPDATE recuperacoes_senha_admin
       SET usado_em = NOW()
       WHERE administrador_id = ?
       AND usado_em IS NULL`,
      [admin.id]
    );

    // Cria o novo código com validade de 10 minutos.
    const [resultado] = await pool.query(
      `INSERT INTO recuperacoes_senha_admin
       (administrador_id, codigo_hash, expira_em)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [admin.id, codigoHash]
    );

    try {
      await enviarCodigoRecuperacao(admin.email, codigo);
    } catch (error) {
      await pool.query(
        `UPDATE recuperacoes_senha_admin
         SET usado_em = NOW()
         WHERE id = ?`,
        [resultado.insertId]
      );

      throw error;
    }

    return res.status(200).json({
      mensagem: "Se o e-mail estiver cadastrado, você receberá um código de recuperação."
    });

  } catch (error) {
    next(error);
  }
}


// 2. Verificar código de recuperação

export async function verificarCodigoAdmin(req, res, next) {
  try {
    const { email, codigo } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof codigo !== "string" ||
      !email.trim() ||
      !/^\d{6}$/.test(codigo)
    ) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e o código de seis dígitos."
      });
    }

    const emailLimpo = email.trim().toLowerCase();

    const [recuperacoes] = await pool.query(
      `SELECT r.id, r.administrador_id, r.codigo_hash
       FROM recuperacoes_senha_admin r
       INNER JOIN administradores a
         ON a.id = r.administrador_id
       WHERE LOWER(a.email) = ?
         AND a.ativo = TRUE
         AND r.usado_em IS NULL
         AND r.expira_em > NOW()
       ORDER BY r.criado_em DESC
       LIMIT 1`,
      [emailLimpo]
    );

    if (recuperacoes.length === 0) {
      return res.status(400).json({
        mensagem: "Código inválido ou expirado."
      });
    }

    const recuperacao = recuperacoes[0];

    const codigoValido = await bcrypt.compare(
      codigo,
      recuperacao.codigo_hash
    );

    if (!codigoValido) {
      return res.status(400).json({
        mensagem: "Código inválido ou expirado."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    // Token temporário que autoriza somente a redefinição da senha.
    const resetToken = jwt.sign(
      {
        tipo: "admin",
        finalidade: "redefinir_senha",
        recuperacaoId: recuperacao.id
      },
      process.env.JWT_SECRET,
      {
        subject: String(recuperacao.administrador_id),
        expiresIn: "10m",
        algorithm: "HS256"
      }
    );

    return res.status(200).json({
      mensagem: "Código verificado com sucesso.",
      resetToken
    });

  } catch (error) {
    next(error);
  }
}


// 3. Redefinir senha do administrador

export async function redefinirSenhaAdmin(req, res, next) {
  let conexao;

  try {
    const { resetToken, novaSenha } = req.body ?? {};

    if (
      typeof resetToken !== "string" ||
      typeof novaSenha !== "string" ||
      novaSenha.length < 8
    ) {
      return res.status(400).json({
        mensagem: "Informe uma nova senha com pelo menos 8 caracteres."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    let dadosToken;

    try {
      dadosToken = jwt.verify(
        resetToken,
        process.env.JWT_SECRET,
        { algorithms: ["HS256"] }
      );
    } catch {
      return res.status(401).json({
        mensagem: "Autorização inválida ou expirada. Solicite um novo código."
      });
    }

    if (
      dadosToken.tipo !== "admin" ||
      dadosToken.finalidade !== "redefinir_senha" ||
      !dadosToken.recuperacaoId ||
      !dadosToken.sub
    ) {
      return res.status(401).json({
        mensagem: "Autorização inválida."
      });
    }

    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    // Bloqueia o registro durante a operação para impedir reutilização.
    const [recuperacoes] = await conexao.query(
      `SELECT id
       FROM recuperacoes_senha_admin
       WHERE id = ?
         AND administrador_id = ?
         AND usado_em IS NULL
         AND expira_em > NOW()
       FOR UPDATE`,
      [dadosToken.recuperacaoId, dadosToken.sub]
    );

    if (recuperacoes.length === 0) {
      await conexao.rollback();

      return res.status(401).json({
        mensagem: "Código já utilizado ou expirado. Solicite uma nova recuperação."
      });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await conexao.query(
      `UPDATE administradores
       SET senha_hash = ?
       WHERE id = ? AND ativo = TRUE`,
      [novaSenhaHash, dadosToken.sub]
    );

    // Marca o código como utilizado.
    await conexao.query(
      `UPDATE recuperacoes_senha_admin
       SET usado_em = NOW()
       WHERE id = ?`,
      [dadosToken.recuperacaoId]
    );

    await conexao.commit();

    return res.status(200).json({
      mensagem: "Senha alterada com sucesso!"
    });

  } catch (error) {
    if (conexao) {
      await conexao.rollback();
    }

    next(error);

  } finally {
    if (conexao) {
      conexao.release();
    }
  }
}
