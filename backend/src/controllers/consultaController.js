
import { pool } from "../config/database.js";

export async function solicitarConsulta(req, res, next) {
  const pacienteId = req.paciente.id;

  const {
    medico_id,
    unidade_id,
    especialidade_id,
    setor_id,
    data_hora,
    observacoes
  } = req.body ?? {};

  const ids = { medico_id, unidade_id, especialidade_id, setor_id };

  for (const [campo, valor] of Object.entries(ids)) {
    if (
      !Number.isSafeInteger(valor) ||
      valor <= 0
    ) {
      return res.status(400).json({
        mensagem: `O campo ${campo} deve ser um ID inteiro positivo.`
      });
    }
  }

  if (
    typeof data_hora !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(data_hora)
  ) {
    return res.status(400).json({
      mensagem: "Informe a data e a hora no formato AAAA-MM-DDTHH:mm."
    });
  }

  const dataHora = new Date(data_hora);

  if (
    Number.isNaN(dataHora.getTime()) ||
    dataHora.toISOString().slice(0, 16) !== data_hora.slice(0, 16)
  ) {
    return res.status(400).json({
      mensagem: "A data ou o horário informado é inválido."
    });
  }

  if (dataHora.getTime() <= Date.now()) {
    return res.status(400).json({
      mensagem: "A consulta deve ser solicitada para uma data futura."
    });
  }

  if (
    observacoes !== undefined &&
    observacoes !== null &&
    (
      typeof observacoes !== "string" ||
      observacoes.trim().length > 1000
    )
  ) {
    return res.status(400).json({
      mensagem: "As observações devem ter no máximo 1000 caracteres."
    });
  }

  let conexao;

  try {
    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    const [vinculos] = await conexao.query(
      `SELECT 1
       FROM medicos m
       INNER JOIN medico_unidade_setores mus
         ON mus.medico_id = m.id
       INNER JOIN unidade_setores us
         ON us.unidade_id = mus.unidade_id
        AND us.setor_id = mus.setor_id
       INNER JOIN unidades u
         ON u.id = us.unidade_id
       INNER JOIN medico_especialidades me
         ON me.medico_id = m.id
       WHERE m.id = ?
         AND u.id = ?
         AND me.especialidade_id = ?
         AND mus.setor_id = ?
         AND m.ativo = TRUE
         AND u.ativo = TRUE
       LIMIT 1`,
      [medico_id, unidade_id, especialidade_id, setor_id]
    );

    if (vinculos.length === 0) {
      await conexao.rollback();

      return res.status(400).json({
        mensagem:
          "O médico não possui esse vínculo de unidade, setor e especialidade."
      });
    }

    const [conflitos] = await conexao.query(
      `SELECT id
       FROM consultas
       WHERE medico_id = ?
         AND data_hora = ?
         AND status IN ('pendente', 'confirmada')
       LIMIT 1
       FOR UPDATE`,
      [
        medico_id,
        dataHora.toISOString().slice(0, 19).replace("T", " ")
      ]
    );

    if (conflitos.length > 0) {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: "Já existe uma consulta solicitada ou confirmada para esse médico nesse horário."
      });
    }

    const [resultado] = await conexao.query(
      `INSERT INTO consultas (
        paciente_id,
        medico_id,
        unidade_id,
        especialidade_id,
        setor_id,
        data_hora,
        status,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, 'pendente', ?)`,
      [
        pacienteId,
        medico_id,
        unidade_id,
        especialidade_id,
        setor_id,
        dataHora.toISOString().slice(0, 19).replace("T", " "),
        observacoes?.trim() || null
      ]
    );

    await conexao.commit();

    return res.status(201).json({
      mensagem: "Solicitação de consulta registrada. Aguarde a confirmação da unidade.",
      consulta: {
        id: resultado.insertId,
        paciente_id: pacienteId,
        medico_id,
        unidade_id,
        especialidade_id,
        setor_id,
        data_hora: dataHora.toISOString().slice(0, 19).replace("T", " "),
        status: "pendente"
      }
    });
  } catch (error) {
    if (conexao) {
      try {
        await conexao.rollback();
      } catch (erroRollback) {
        console.error("Erro ao desfazer solicitação:", erroRollback);
      }
    }

    return next(error);
  } finally {
    conexao?.release();
  }
}


export async function listarMinhasConsultas(req, res, next) {
  try {
    const pacienteId = req.paciente.id;

    const [consultas] = await pool.query(
      `SELECT
         c.id,
         c.data_hora,
         c.status,
         c.observacoes,
         c.criado_em,
         u.id AS unidade_id,
         u.nome AS unidade,
         u.rua,
         u.bairro,
         m.id AS medico_id,
         m.nome_completo AS medico,
         m.crm,
         m.uf_crm,
         e.id AS especialidade_id,
         e.nome AS especialidade,
         s.id AS setor_id,
         s.nome AS setor
       FROM consultas c
       INNER JOIN unidades u ON u.id = c.unidade_id
       INNER JOIN medicos m ON m.id = c.medico_id
       INNER JOIN especialidades e ON e.id = c.especialidade_id
       INNER JOIN setores s ON s.id = c.setor_id
       WHERE c.paciente_id = ?
       ORDER BY c.data_hora DESC, c.id DESC`,
      [pacienteId]
    );

    return res.status(200).json({
      total: consultas.length,
      consultas
    });
  } catch (error) {
    return next(error);
  }
}
