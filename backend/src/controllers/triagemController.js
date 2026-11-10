
import { pool } from "../config/database.js";

// REGISTRAR TRIAGEM
export async function criarTriagem(req, res, next) {
  const {
    paciente_id,
    queixa_principal,
    sintomas,
    inicio_sintomas,
    intensidade_dor,
    pressao_arterial,
    temperatura,
    frequencia_cardiaca,
    frequencia_respiratoria,
    saturacao_oxigenio,
    glicemia,
    peso,
    altura,
    classificacao_risco,
    observacoes
  } = req.body ?? {};

  const camposNumericos = [
    ["intensidade_dor", intensidade_dor, 0, 10],
    ["temperatura", temperatura, 25, 45],
    ["frequencia_cardiaca", frequencia_cardiaca, 1, 300],
    ["frequencia_respiratoria", frequencia_respiratoria, 1, 100],
    ["saturacao_oxigenio", saturacao_oxigenio, 0, 100],
    ["glicemia", glicemia, 0, 1000],
    ["peso", peso, 0.1, 500],
    ["altura", altura, 0.1, 3]
  ];

  if (!Number.isSafeInteger(Number(paciente_id)) || Number(paciente_id) <= 0) {
    return res.status(400).json({
      mensagem: "ID do paciente inválido."
    });
  }

  if (
    typeof queixa_principal !== "string" ||
    !queixa_principal.trim() ||
    queixa_principal.trim().length > 2000
  ) {
    return res.status(400).json({
      mensagem: "Informe uma queixa principal válida."
    });
  }

  if (
    typeof classificacao_risco !== "string" ||
    !["vermelho", "laranja", "amarelo", "verde", "azul"].includes(
      classificacao_risco.toLowerCase()
    )
  ) {
    return res.status(400).json({
      mensagem: "Classificação de risco inválida."
    });
  }

  for (const [campo, valor, minimo, maximo] of camposNumericos) {
    if (
      valor !== undefined &&
      valor !== null &&
      valor !== "" &&
      (
        !Number.isFinite(Number(valor)) ||
        Number(valor) < minimo ||
        Number(valor) > maximo
      )
    ) {
      return res.status(400).json({
        mensagem: `Valor inválido para o campo ${campo}.`
      });
    }
  }

  if (
    sintomas != null && (typeof sintomas !== "string" || sintomas.length > 5000) ||
    observacoes != null && (typeof observacoes !== "string" || observacoes.length > 5000) ||
    inicio_sintomas != null && (typeof inicio_sintomas !== "string" || inicio_sintomas.length > 100) ||
    pressao_arterial != null && (typeof pressao_arterial !== "string" || pressao_arterial.length > 20)
  ) {
    return res.status(400).json({
      mensagem: "Um ou mais campos de texto possuem formato inválido."
    });
  }

  try {
    const [pacientes] = await pool.query(
      `SELECT id FROM pacientes
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [paciente_id]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        mensagem: "Paciente não encontrado ou inativo."
      });
    }

    const [resultado] = await pool.query(
      `INSERT INTO triagens (
        paciente_id,
        enfermeiro_id,
        queixa_principal,
        sintomas,
        inicio_sintomas,
        intensidade_dor,
        pressao_arterial,
        temperatura,
        frequencia_cardiaca,
        frequencia_respiratoria,
        saturacao_oxigenio,
        glicemia,
        peso,
        altura,
        classificacao_risco,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paciente_id,
        req.enfermeiro.id,
        queixa_principal.trim(),
        sintomas?.trim() || null,
        inicio_sintomas?.trim() || null,
        intensidade_dor ?? null,
        pressao_arterial?.trim() || null,
        temperatura ?? null,
        frequencia_cardiaca ?? null,
        frequencia_respiratoria ?? null,
        saturacao_oxigenio ?? null,
        glicemia ?? null,
        peso ?? null,
        altura ?? null,
        classificacao_risco.toLowerCase(),
        observacoes?.trim() || null
      ]
    );

    return res.status(201).json({
      mensagem: "Triagem registrada com sucesso!",
      triagem: {
        id: resultado.insertId,
        paciente_id: Number(paciente_id),
        enfermeiro_id: req.enfermeiro.id,
        classificacao_risco: classificacao_risco.toLowerCase()
      }
    });
  } catch (error) {
    return next(error);
  }
}

// LISTAR TRIAGENS
export async function listarTriagens(req, res, next) {
  try {
    const [triagens] = await pool.query(
      `SELECT
        t.id,
        t.paciente_id,
        p.nome_completo AS paciente,
        t.enfermeiro_id,
        e.nome_completo AS enfermeiro,
        t.queixa_principal,
        t.classificacao_risco,
        t.criado_em
       FROM triagens t
       INNER JOIN pacientes p ON p.id = t.paciente_id
       INNER JOIN enfermeiros e ON e.id = t.enfermeiro_id
       ORDER BY t.criado_em DESC`
    );

    return res.status(200).json(triagens);
  } catch (error) {
    next(error);
  }
}

// BUSCAR TRIAGEM POR ID
export async function buscarTriagem(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da triagem inválido."
      });
    }

    const [triagens] = await pool.query(
      `SELECT
        t.*,
        p.nome_completo AS paciente,
        e.nome_completo AS enfermeiro
       FROM triagens t
       INNER JOIN pacientes p ON p.id = t.paciente_id
       INNER JOIN enfermeiros e ON e.id = t.enfermeiro_id
       WHERE t.id = ?
       LIMIT 1`,
      [id]
    );

    if (triagens.length === 0) {
      return res.status(404).json({
        mensagem: "Triagem não encontrada."
      });
    }

    return res.status(200).json(triagens[0]);
  } catch (error) {
    next(error);
  }
}

// LISTAR TRIAGENS DE UM PACIENTE
export async function listarTriagensDoPaciente(req, res, next) {
  try {
    const { pacienteId } = req.params;

    if (!/^[1-9]\d*$/.test(pacienteId)) {
      return res.status(400).json({
        mensagem: "ID do paciente inválido."
      });
    }

    const [triagens] = await pool.query(
      `SELECT
        t.id,
        t.queixa_principal,
        t.classificacao_risco,
        t.criado_em,
        e.nome_completo AS enfermeiro
       FROM triagens t
       INNER JOIN enfermeiros e ON e.id = t.enfermeiro_id
       WHERE t.paciente_id = ?
       ORDER BY t.criado_em DESC`,
      [pacienteId]
    );

    return res.status(200).json(triagens);
  } catch (error) {
    next(error);
  }
}

// VINCULAR TRIAGEM A UMA CONSULTA
export async function vincularTriagemConsulta(req, res, next) {
  try {
    const { id } = req.params;
    const { consulta_id } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da triagem inválido."
      });
    }

    if (!Number.isInteger(Number(consulta_id)) || Number(consulta_id) <= 0) {
      return res.status(400).json({
        mensagem: "ID da consulta inválido."
      });
    }

    const [triagens] = await pool.query(
      `SELECT id, paciente_id, consulta_id
       FROM triagens
       WHERE id = ?`,
      [id]
    );

    if (triagens.length === 0) {
      return res.status(404).json({
        mensagem: "Triagem não encontrada."
      });
    }

    const triagem = triagens[0];

    if (triagem.consulta_id !== null) {
      return res.status(409).json({
        mensagem: "Esta triagem já está vinculada a uma consulta."
      });
    }

    const [consultas] = await pool.query(
      `SELECT id, paciente_id
       FROM consultas
       WHERE id = ?`,
      [consulta_id]
    );

    if (consultas.length === 0) {
      return res.status(404).json({
        mensagem: "Consulta não encontrada."
      });
    }

    if (consultas[0].paciente_id !== triagem.paciente_id) {
      return res.status(400).json({
        mensagem: "A consulta pertence a outro paciente."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE triagens
       SET consulta_id = ?
       WHERE id = ?
       AND consulta_id IS NULL`,
      [consulta_id, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(409).json({
        mensagem: "Não foi possível vincular a triagem."
      });
    }

    return res.status(200).json({
      mensagem: "Triagem vinculada à consulta com sucesso.",
      triagem_id: Number(id),
      consulta_id: Number(consulta_id)
    });
  } catch (error) {
    return next(error);
  }
}