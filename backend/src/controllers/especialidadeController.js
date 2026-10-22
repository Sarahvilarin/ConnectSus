
import { pool } from "../config/database.js";

// Listar todas as especialidades
export async function listarEspecialidades(req, res, next) {
  try {
    const [especialidades] = await pool.query(`
      SELECT id, nome
      FROM especialidades
      ORDER BY nome ASC
    `);

    res.status(200).json(especialidades);
  } catch (error) {
    next(error);
  }
}

// Buscar uma especialidade pelo ID
export async function buscarEspecialidade(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const [especialidades] = await pool.query(
      `SELECT id, nome
       FROM especialidades
       WHERE id = ?`,
      [id]
    );

    if (especialidades.length === 0) {
      return res.status(404).json({
        mensagem: "Especialidade não encontrada."
      });
    }

    res.status(200).json(especialidades[0]);
  } catch (error) {
    next(error);
  }
}


// CADASTRAR ESPECIALIDADE
export async function criarEspecialidade(req, res, next) {
  try {
    const { nome } = req.body ?? {};

    if (
      typeof nome !== "string" ||
      nome.trim().length < 3 ||
      nome.trim().length > 100
    ) {
      return res.status(400).json({
        mensagem: "Informe um nome válido de 3 a 100 caracteres."
      });
    }

    const [resultado] = await pool.query(
      "INSERT INTO especialidades (nome) VALUES (?)",
      [nome.trim()]
    );

    return res.status(201).json({
      mensagem: "Especialidade cadastrada com sucesso!",
      id: resultado.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Especialidade já cadastrada."
      });
    }

    next(error);
  }
}

// ATUALIZAR ESPECIALIDADE
export async function atualizarEspecialidade(req, res, next) {
  try {
    const { id } = req.params;
    const { nome } = req.body ?? {};

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    if (
      typeof nome !== "string" ||
      nome.trim().length < 3 ||
      nome.trim().length > 100
    ) {
      return res.status(400).json({
        mensagem: "Informe um nome válido de 3 a 100 caracteres."
      });
    }

    const [resultado] = await pool.query(
      "UPDATE especialidades SET nome = ? WHERE id = ?",
      [nome.trim(), id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Especialidade não encontrada."
      });
    }

    return res.status(200).json({
      mensagem: "Especialidade atualizada com sucesso!"
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Já existe uma especialidade com esse nome."
      });
    }

    next(error);
  }
}
