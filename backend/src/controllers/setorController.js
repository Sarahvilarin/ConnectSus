
import { pool } from "../config/database.js";

// Listar todos os setores cadastrados
export async function listarSetores(req, res, next) {
  try {
    const [setores] = await pool.query(`
      SELECT id, nome
      FROM setores
      ORDER BY nome ASC
    `);

    res.status(200).json(setores);
  } catch (error) {
    next(error);
  }
}

// Consultar os setores de uma unidade
export async function listarSetoresPorUnidade(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da unidade inválido."
      });
    }

    const [unidades] = await pool.query(
      "SELECT id FROM unidades WHERE id = ? AND ativo = TRUE",
      [id]
    );

    if (unidades.length === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada."
      });
    }

    const [setores] = await pool.query(
      `SELECT s.id, s.nome
       FROM setores s
       INNER JOIN unidade_setores us
         ON us.setor_id = s.id
       WHERE us.unidade_id = ?
       ORDER BY s.nome ASC`,
      [id]
    );

    res.status(200).json(setores);
  } catch (error) {
    next(error);
  }
}


// VINCULAR SETOR A UMA UNIDADE
export async function vincularSetor(req, res, next) {
  try {
    const { id, setorId } = req.params;

    if (
      !/^[1-9]\d*$/.test(id) ||
      !/^[1-9]\d*$/.test(setorId)
    ) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const [unidades] = await pool.query(
      "SELECT id FROM unidades WHERE id = ? AND ativo = TRUE",
      [id]
    );

    if (unidades.length === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada ou desativada."
      });
    }

    const [setores] = await pool.query(
      "SELECT id FROM setores WHERE id = ?",
      [setorId]
    );

    if (setores.length === 0) {
      return res.status(404).json({
        mensagem: "Setor não encontrado."
      });
    }

    const [resultado] = await pool.query(
      `INSERT IGNORE INTO unidade_setores
       (unidade_id, setor_id)
       VALUES (?, ?)`,
      [id, setorId]
    );

    if (resultado.affectedRows === 0) {
      return res.status(409).json({
        mensagem: "Setor já vinculado à unidade."
      });
    }

    return res.status(201).json({
      mensagem: "Setor vinculado com sucesso!"
    });
  } catch (error) {
    next(error);
  }
}

// REMOVER VÍNCULO ENTRE SETOR E UNIDADE
export async function desvincularSetor(req, res, next) {
  try {
    const { id, setorId } = req.params;

    if (
      !/^[1-9]\d*$/.test(id) ||
      !/^[1-9]\d*$/.test(setorId)
    ) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const [resultado] = await pool.query(
      `DELETE FROM unidade_setores
       WHERE unidade_id = ? AND setor_id = ?`,
      [id, setorId]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Vínculo não encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Setor desvinculado com sucesso!"
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        mensagem: "Não é possível remover o setor porque existem médicos vinculados a ele nesta unidade."
      });
    }

    next(error);
  }
}


export async function criarSetor(req, res, next) {
  try {
    const { nome } = req.body ?? {};

    if (
      typeof nome !== "string" ||
      nome.trim().length < 3 ||
      nome.trim().length > 100
    ) {
      return res.status(400).json({
        mensagem: "O nome deve ter entre 3 e 100 caracteres."
      });
    }

    const [resultado] = await pool.query(
      "INSERT INTO setores (nome) VALUES (?)",
      [nome.trim()]
    );

    return res.status(201).json({
      mensagem: "Setor cadastrado com sucesso!",
      setor: {
        id: resultado.insertId,
        nome: nome.trim()
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Já existe um setor com esse nome."
      });
    }

    next(error);
  }
}


// ATUALIZAR SETOR
export async function atualizarSetor(req, res, next) {
  try {
    const { id } = req.params;
    const { nome } = req.body ?? {};

    // Validar ID
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do setor inválido."
      });
    }

    // Validar nome
    if (
      typeof nome !== "string" ||
      nome.trim().length < 3 ||
      nome.trim().length > 100
    ) {
      return res.status(400).json({
        mensagem: "O nome deve ter entre 3 e 100 caracteres."
      });
    }

    // Atualizar no MySQL
    const [resultado] = await pool.query(
      `UPDATE setores
       SET nome = ?
       WHERE id = ?`,
      [nome.trim(), id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Setor não encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Setor atualizado com sucesso!",
      setor: {
        id: Number(id),
        nome: nome.trim()
      }
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Já existe um setor com esse nome."
      });
    }

    next(error);
  }
}

