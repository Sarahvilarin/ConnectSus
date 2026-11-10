
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import { validarEnfermeiro } from "../validators/enfermeiroValidator.js";

// CADASTRAR ENFERMEIRO
export async function criarEnfermeiro(req, res, next) {
  const erros = validarEnfermeiro(req.body);

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: "Dados inválidos.",
      erros
    });
  }

  const {
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    coren,
    uf_coren,
    senha
  } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado] = await pool.query(
      `INSERT INTO enfermeiros (
        nome_completo,
        cpf,
        data_nascimento,
        email,
        telefone,
        coren,
        uf_coren,
        senha_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome_completo.trim(),
        cpf,
        data_nascimento,
        email.trim().toLowerCase(),
        telefone ?? null,
        coren,
        uf_coren,
        senhaHash
      ]
    );

    return res.status(201).json({
      mensagem: "Enfermeiro cadastrado com sucesso!",
      enfermeiro: {
        id: resultado.insertId,
        nome_completo,
        email,
        coren,
        uf_coren
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CPF, e-mail ou COREN já cadastrado."
      });
    }

    return next(error);
  }
}

// LISTAR ENFERMEIROS ATIVOS
export async function listarEnfermeiros(req, res, next) {
  try {
    const [enfermeiros] = await pool.query(`
      SELECT
        id,
        nome_completo,
        coren,
        uf_coren,
        ativo
      FROM enfermeiros
      WHERE ativo = TRUE
      ORDER BY nome_completo ASC
    `);

    return res.status(200).json(enfermeiros);
  } catch (error) {
    next(error);
  }
}

// BUSCAR ENFERMEIRO POR ID
export async function buscarEnfermeiro(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do enfermeiro inválido."
      });
    }

    const [enfermeiros] = await pool.query(
      `SELECT
        id,
        nome_completo,
        cpf,
        email,
        telefone,
        coren,
        uf_coren,
        DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS data_nascimento,
        ativo
       FROM enfermeiros
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (enfermeiros.length === 0) {
      return res.status(404).json({
        mensagem: "Enfermeiro não encontrado."
      });
    }

    return res.status(200).json(enfermeiros[0]);
  } catch (error) {
    next(error);
  }
}

// ATUALIZAR ENFERMEIRO
export async function atualizarEnfermeiro(req, res, next) {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      mensagem: "ID do enfermeiro inválido."
    });
  }

  const erros = validarEnfermeiro(req.body, false);

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: "Dados inválidos.",
      erros
    });
  }

  const {
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    coren,
    uf_coren,
    senha
  } = req.body;

  try {
    const senhaHash = senha
      ? await bcrypt.hash(senha, 12)
      : null;

    const [resultado] = await pool.query(
      `UPDATE enfermeiros SET
        nome_completo = ?,
        cpf = ?,
        data_nascimento = ?,
        email = ?,
        telefone = ?,
        coren = ?,
        uf_coren = ?
       WHERE id = ? AND ativo = TRUE`,
      [
        nome_completo.trim(),
        cpf,
        data_nascimento,
        email.trim().toLowerCase(),
        telefone ?? null,
        coren,
        uf_coren,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Enfermeiro não encontrado."
      });
    }

    if (senhaHash) {
      await pool.query(
        "UPDATE enfermeiros SET senha_hash = ? WHERE id = ?",
        [senhaHash, id]
      );
    }

    return res.status(200).json({
      mensagem: "Enfermeiro atualizado com sucesso!",
      id: Number(id)
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CPF, e-mail ou COREN já cadastrado."
      });
    }

    next(error);
  }
}

// DESATIVAR ENFERMEIRO
export async function excluirEnfermeiro(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do enfermeiro inválido."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE enfermeiros
       SET ativo = FALSE
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Enfermeiro não encontrado ou já desativado."
      });
    }

    return res.status(200).json({
      mensagem: "Enfermeiro desativado com sucesso!"
    });
  } catch (error) {
    next(error);
  }
}

// REATIVAR ENFERMEIRO
export async function reativarEnfermeiro(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do enfermeiro inválido."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE enfermeiros
       SET ativo = TRUE
       WHERE id = ? AND ativo = FALSE`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Enfermeiro não encontrado ou já ativo."
      });
    }

    return res.status(200).json({
      mensagem: "Enfermeiro reativado com sucesso!"
    });
  } catch (error) {
    next(error);
  }
}


// PERFIL DO ENFERMEIRO AUTENTICADO
export async function meuPerfilEnfermeiro(req, res, next) {
  try {
    const [enfermeiros] = await pool.query(
      `SELECT
        id,
        nome_completo,
        email,
        telefone,
        coren,
        uf_coren
       FROM enfermeiros
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [req.enfermeiro.id]
    );

    if (enfermeiros.length === 0) {
      return res.status(404).json({
        mensagem: "Enfermeiro não encontrado."
      });
    }

    return res.status(200).json(enfermeiros[0]);
  } catch (error) {
    next(error);
  }
}
