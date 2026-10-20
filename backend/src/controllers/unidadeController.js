
import { pool } from "../config/database.js";

// LISTAR UNIDADES
export async function listarUnidades(req, res, next) {
  try {
    const [unidades] = await pool.query(`
      SELECT
        u.id,
        u.nome,
        u.cnes,
        t.nome AS tipo,
        u.rua,
        u.bairro,
        u.cep,
        u.telefone,
        u.horario_funcionamento,
        u.servicos_disponiveis
      FROM unidades u
      INNER JOIN tipos_unidade t
        ON u.tipo_unidade_id = t.id
      WHERE u.ativo = TRUE
      ORDER BY u.nome
    `);

    res.status(200).json(unidades);
  } catch (error) {
    next(error);
  }
}

// BUSCAR UNIDADE POR ID
export async function buscarUnidade(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const [unidades] = await pool.query(
      `SELECT
        u.id,
        u.nome,
        u.cnes,
        t.nome AS tipo,
        u.rua,
        u.bairro,
        u.cep,
        u.telefone,
        u.horario_funcionamento,
        u.servicos_disponiveis
      FROM unidades u
      INNER JOIN tipos_unidade t
        ON u.tipo_unidade_id = t.id
      WHERE u.id = ? AND u.ativo = TRUE`,
      [id]
    );

    if (unidades.length === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada."
      });
    }

    res.status(200).json(unidades[0]);
  } catch (error) {
    next(error);
  }
}

// CADASTRAR UNIDADE
export async function criarUnidade(req, res, next) {
  try {
    const {
      nome,
      cnes,
      tipo_unidade_id,
      rua,
      bairro,
      cep,
      telefone,
      horario_funcionamento,
      servicos_disponiveis
    } = req.body;

    if (
      !nome ||
      !cnes ||
      !tipo_unidade_id ||
      !rua ||
      !bairro ||
      !cep
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    // Verificar se CNES já está cadastrado
    const [existentes] = await pool.query(
      "SELECT id FROM unidades WHERE cnes = ?",
      [cnes]
    );

    if (existentes.length > 0) {
      return res.status(409).json({
        mensagem: "Já existe uma unidade com esse CNES."
      });
    }

    const [resultado] = await pool.query(
      `INSERT INTO unidades (
        nome,
        cnes,
        tipo_unidade_id,
        rua,
        bairro,
        cep,
        telefone,
        horario_funcionamento,
        servicos_disponiveis
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        cnes,
        tipo_unidade_id,
        rua,
        bairro,
        cep,
        telefone ?? null,
        horario_funcionamento ?? null,
        servicos_disponiveis ?? null
      ]
    );

    res.status(201).json({
      mensagem: "Unidade cadastrada com sucesso!",
      id: resultado.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CNES já cadastrado."
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "Tipo de unidade inválido."
      });
    }

    next(error);
  }
}

// ATUALIZAR UNIDADE
export async function atualizarUnidade(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const {
      nome,
      cnes,
      tipo_unidade_id,
      rua,
      bairro,
      cep,
      telefone,
      horario_funcionamento,
      servicos_disponiveis
    } = req.body;

    if (
      !nome ||
      !cnes ||
      !tipo_unidade_id ||
      !rua ||
      !bairro ||
      !cep
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE unidades
       SET nome = ?,
           cnes = ?,
           tipo_unidade_id = ?,
           rua = ?,
           bairro = ?,
           cep = ?,
           telefone = ?,
           horario_funcionamento = ?,
           servicos_disponiveis = ?
       WHERE id = ? AND ativo = TRUE`,
      [
        nome,
        cnes,
        tipo_unidade_id,
        rua,
        bairro,
        cep,
        telefone ?? null,
        horario_funcionamento ?? null,
        servicos_disponiveis ?? null,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada."
      });
    }

    res.status(200).json({
      mensagem: "Unidade atualizada com sucesso!"
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CNES já cadastrado."
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "Tipo de unidade inválido."
      });
    }

    next(error);
  }
}

// DESATIVAR UNIDADE
export async function excluirUnidade(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE unidades
       SET ativo = FALSE
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada."
      });
    }

    res.status(200).json({
      mensagem: "Unidade desativada com sucesso!"
    });
  } catch (error) {
    next(error);
  }
}
