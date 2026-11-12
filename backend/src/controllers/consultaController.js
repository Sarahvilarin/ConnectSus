
import { pool } from "../config/database.js";

// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function validarDataHoraConsulta(valor) {
  if (
    typeof valor !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)
  ) {
    return false;
  }

  const [data, hora] = valor.split("T");
  const [ano, mes, dia] = data.split("-").map(Number);
  const [h, min] = hora.split(":").map(Number);

  const dataValidada = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    dataValidada.getUTCFullYear() === ano &&
    dataValidada.getUTCMonth() === mes - 1 &&
    dataValidada.getUTCDate() === dia &&
    h >= 8 &&
    h <= 16 &&
    (min === 0 || min === 30) &&
    dataValidada.getUTCDay() >= 1 &&
    dataValidada.getUTCDay() <= 5
  );
}

function formatarDataHoraMySQL(valor) {
  return `${valor.replace("T", " ")}:00`;
}

// ======================================================
// DISPONIBILIDADE DE HORÁRIOS PARA O PACIENTE
// ======================================================

export async function listarDisponibilidadeConsultas(req, res, next) {
  try {
    const { unidade_id, especialidade_id, data } = req.query;

    const unidadeId = Number(unidade_id);
    const especialidadeId = Number(especialidade_id);

    if (
      !Number.isSafeInteger(unidadeId) ||
      unidadeId <= 0 ||
      !Number.isSafeInteger(especialidadeId) ||
      especialidadeId <= 0
    ) {
      return res.status(400).json({
        mensagem: "Informe uma unidade e uma especialidade válidas."
      });
    }

    if (
      typeof data !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {
      return res.status(400).json({
        mensagem: "Informe uma data válida."
      });
    }

    const dataValidada = new Date(`${data}T00:00:00Z`);

    if (
      Number.isNaN(dataValidada.getTime()) ||
      dataValidada.toISOString().slice(0, 10) !== data
    ) {
      return res.status(400).json({
        mensagem: "A data informada é inválida."
      });
    }

    const diaSemana = dataValidada.getUTCDay();

    if (diaSemana === 0 || diaSemana === 6) {
      return res.status(200).json({
        data,
        horarios: []
      });
    }

    const [unidades] = await pool.query(
      `SELECT id
       FROM unidades
       WHERE id = ?
         AND ativo = TRUE`,
      [unidadeId]
    );

    if (unidades.length === 0) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada ou inativa."
      });
    }

    const [especialidades] = await pool.query(
      `SELECT id
       FROM especialidades
       WHERE id = ?`,
      [especialidadeId]
    );

    if (especialidades.length === 0) {
      return res.status(404).json({
        mensagem: "Especialidade não encontrada."
      });
    }

    const horarios = [];

    for (let hora = 8; hora <= 16; hora++) {
      for (const minuto of [0, 30]) {
        const horario =
          `${String(hora).padStart(2, "0")}:` +
          `${String(minuto).padStart(2, "0")}`;

        const dataHora = `${data} ${horario}:00`;

        const [medicos] = await pool.query(
          `SELECT DISTINCT m.id
           FROM medicos m
           INNER JOIN medico_unidade_setores mus
             ON mus.medico_id = m.id
           INNER JOIN unidade_setores us
             ON us.unidade_id = mus.unidade_id
            AND us.setor_id = mus.setor_id
           INNER JOIN medico_especialidades me
             ON me.medico_id = m.id
           WHERE mus.unidade_id = ?
             AND me.especialidade_id = ?
             AND m.ativo = TRUE
             AND ? > NOW()
             AND NOT EXISTS (
               SELECT 1
               FROM consultas c
               WHERE c.medico_id = m.id
                 AND c.data_hora = ?
                 AND c.status IN ('pendente', 'confirmada')
             )
           ORDER BY m.id`,
          [unidadeId, especialidadeId, dataHora, dataHora]
        );

        if (medicos.length > 0) {
          horarios.push(horario);
        }
      }
    }

    const [horariosDoPaciente] = await pool.query(
      `SELECT TIME_FORMAT(data_hora, '%H:%i') AS horario
       FROM consultas
       WHERE paciente_id = ?
         AND DATE(data_hora) = ?
         AND status IN ('pendente', 'confirmada')`,
      [req.paciente.id, data]
    );

    const ocupadosPaciente = new Set(
      horariosDoPaciente.map((item) => item.horario)
    );

    const disponiveis = horarios.filter(
      (horario) => !ocupadosPaciente.has(horario)
    );

    return res.status(200).json({
      data,
      horarios: disponiveis
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// SOLICITAR CONSULTA
// O MÉDICO É SELECIONADO AUTOMATICAMENTE PELO BACKEND
// ======================================================

export async function solicitarConsulta(req, res, next) {
  const pacienteId = req.paciente.id;

  const {
    unidade_id,
    especialidade_id,
    data_hora,
    observacoes
  } = req.body ?? {};

  if (
    !Number.isSafeInteger(unidade_id) ||
    unidade_id <= 0 ||
    !Number.isSafeInteger(especialidade_id) ||
    especialidade_id <= 0
  ) {
    return res.status(400).json({
      mensagem: "Informe uma unidade e uma especialidade válidas."
    });
  }

  if (!validarDataHoraConsulta(data_hora)) {
    return res.status(400).json({
      mensagem:
        "Selecione um horário válido, de segunda a sexta, entre 08:00 e 16:30."
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

  const dataHora = formatarDataHoraMySQL(data_hora);

  let conexao;

  try {
    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    const [validacaoHorario] = await conexao.query(
      `SELECT ? > NOW() AS horario_futuro`,
      [dataHora]
    );

    if (!validacaoHorario[0].horario_futuro) {
      await conexao.rollback();

      return res.status(400).json({
        mensagem:
          "Não é possível solicitar uma consulta em um horário passado."
      });
    }

    // Verifica se o paciente já possui consulta no horário.
    const [consultasPaciente] = await conexao.query(
      `SELECT id
       FROM consultas
       WHERE paciente_id = ?
         AND data_hora = ?
         AND status IN ('pendente', 'confirmada')
       LIMIT 1
       FOR UPDATE`,
      [pacienteId, dataHora]
    );

    if (consultasPaciente.length > 0) {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: "Você já possui uma consulta nesse horário."
      });
    }

    // Busca médicos vinculados à unidade, setor e especialidade.
    // O paciente não precisa escolher o profissional.
    const [medicos] = await conexao.query(
      `SELECT DISTINCT
         m.id AS medico_id,
         mus.setor_id
       FROM medicos m
       INNER JOIN medico_unidade_setores mus
         ON mus.medico_id = m.id
       INNER JOIN unidade_setores us
         ON us.unidade_id = mus.unidade_id
        AND us.setor_id = mus.setor_id
       INNER JOIN medico_especialidades me
         ON me.medico_id = m.id
       INNER JOIN unidades u
         ON u.id = mus.unidade_id
       WHERE mus.unidade_id = ?
         AND me.especialidade_id = ?
         AND m.ativo = TRUE
         AND u.ativo = TRUE
         AND NOT EXISTS (
           SELECT 1
           FROM consultas c
           WHERE c.medico_id = m.id
             AND c.data_hora = ?
             AND c.status IN ('pendente', 'confirmada')
         )
       ORDER BY m.id
       FOR UPDATE`,
      [unidade_id, especialidade_id, dataHora]
    );

    if (medicos.length === 0) {
      await conexao.rollback();

      return res.status(409).json({
        mensagem:
          "Esse horário acabou de ficar indisponível. Selecione outro horário."
      });
    }

    // Seleciona automaticamente o primeiro médico disponível.
    const medicoSelecionado = medicos[0];

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
        medicoSelecionado.medico_id,
        unidade_id,
        especialidade_id,
        medicoSelecionado.setor_id,
        dataHora,
        observacoes?.trim() || null
      ]
    );

    await conexao.commit();

    return res.status(201).json({
      mensagem:
        "Solicitação de consulta registrada. Aguarde a confirmação da unidade.",
      consulta: {
        id: resultado.insertId,
        paciente_id: pacienteId,
        unidade_id,
        especialidade_id,
        data_hora: dataHora,
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

// ======================================================
// LISTAR CONSULTAS DO PACIENTE
// ======================================================

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

// ======================================================
// CANCELAR CONSULTA DO PACIENTE
// ======================================================

export async function cancelarMinhaConsulta(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da consulta inválido."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE consultas
       SET status = 'cancelada'
       WHERE id = ?
         AND paciente_id = ?
         AND status IN ('pendente', 'confirmada')`,
      [id, req.paciente.id]
    );

    if (resultado.affectedRows === 0) {
      const [consultas] = await pool.query(
        `SELECT id, status
         FROM consultas
         WHERE id = ? AND paciente_id = ?`,
        [id, req.paciente.id]
      );

      if (consultas.length === 0) {
        return res.status(404).json({
          mensagem: "Consulta não encontrada."
        });
      }

      return res.status(409).json({
        mensagem: `Não é possível cancelar uma consulta com status "${consultas[0].status}".`
      });
    }

    return res.status(200).json({
      mensagem: "Solicitação de consulta cancelada com sucesso.",
      consulta: {
        id: Number(id),
        status: "cancelada"
      }
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// CONFIRMAR CONSULTA PELO MÉDICO
// ======================================================

export async function confirmarConsulta(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da consulta inválido."
      });
    }

    const medicoId = req.medico.id;

    const [resultado] = await pool.query(
      `UPDATE consultas
       SET status = 'confirmada'
       WHERE id = ?
         AND medico_id = ?
         AND status = 'pendente'
         AND EXISTS (
           SELECT 1
           FROM medicos m
           WHERE m.id = consultas.medico_id
             AND m.ativo = TRUE
         )`,
      [id, medicoId]
    );

    if (resultado.affectedRows === 0) {
      const [consultas] = await pool.query(
        `SELECT id, medico_id, status
         FROM consultas
         WHERE id = ?`,
        [id]
      );

      if (consultas.length === 0) {
        return res.status(404).json({
          mensagem: "Consulta não encontrada."
        });
      }

      if (consultas[0].medico_id !== medicoId) {
        return res.status(403).json({
          mensagem:
            "Você não tem permissão para confirmar esta consulta."
        });
      }

      return res.status(409).json({
        mensagem: `Não é possível confirmar uma consulta com status "${consultas[0].status}".`
      });
    }

    return res.status(200).json({
      mensagem: "Consulta confirmada com sucesso.",
      consulta: {
        id: Number(id),
        status: "confirmada"
      }
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// LISTAR CONSULTAS DO MÉDICO
// ======================================================

export async function listarConsultasDoMedico(req, res, next) {
  try {
    const medicoId = req.medico.id;

    const [consultas] = await pool.query(
      `SELECT
         c.id,
         c.data_hora,
         c.status,
         c.observacoes,
         c.criado_em,
         p.id AS paciente_id,
         p.nome_completo AS paciente,
         p.cpf AS paciente_cpf,
         p.data_nascimento AS paciente_data_nascimento,
         p.telefone AS paciente_telefone,
         u.id AS unidade_id,
         u.nome AS unidade,
         u.rua,
         u.bairro,
         e.id AS especialidade_id,
         e.nome AS especialidade,
         s.id AS setor_id,
         s.nome AS setor
       FROM consultas c
       INNER JOIN pacientes p ON p.id = c.paciente_id
       INNER JOIN unidades u ON u.id = c.unidade_id
       INNER JOIN especialidades e ON e.id = c.especialidade_id
       INNER JOIN setores s ON s.id = c.setor_id
       WHERE c.medico_id = ?
       ORDER BY c.data_hora ASC, c.id ASC`,
      [medicoId]
    );

    return res.status(200).json({
      total: consultas.length,
      consultas
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// CONCLUIR CONSULTA PELO MÉDICO
// ======================================================

export async function concluirConsulta(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da consulta inválido."
      });
    }

    const medicoId = req.medico.id;

    const [resultado] = await pool.query(
      `UPDATE consultas
       SET status = 'concluida'
       WHERE id = ?
         AND medico_id = ?
         AND status = 'confirmada'`,
      [id, medicoId]
    );

    if (resultado.affectedRows === 0) {
      const [consultas] = await pool.query(
        `SELECT id, medico_id, status
         FROM consultas
         WHERE id = ?`,
        [id]
      );

      if (consultas.length === 0) {
        return res.status(404).json({
          mensagem: "Consulta não encontrada."
        });
      }

      if (consultas[0].medico_id !== medicoId) {
        return res.status(403).json({
          mensagem:
            "Você não tem permissão para concluir esta consulta."
        });
      }

      return res.status(409).json({
        mensagem: `Não é possível concluir uma consulta com status "${consultas[0].status}".`
      });
    }

    return res.status(200).json({
      mensagem: "Consulta concluída com sucesso.",
      consulta: {
        id: Number(id),
        status: "concluida"
      }
    });
  } catch (error) {
    return next(error);
  }
}

// ======================================================
// BUSCAR TRIAGEM VINCULADA À CONSULTA
// ======================================================

export async function buscarTriagemDaConsulta(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID da consulta inválido."
      });
    }

    const [triagens] = await pool.query(
      `SELECT
         t.id,
         t.paciente_id,
         t.consulta_id,
         t.enfermeiro_id,
         p.nome_completo AS paciente,
         e.nome_completo AS enfermeiro,
         t.queixa_principal,
         t.sintomas,
         t.inicio_sintomas,
         t.intensidade_dor,
         t.pressao_arterial,
         t.temperatura,
         t.frequencia_cardiaca,
         t.frequencia_respiratoria,
         t.saturacao_oxigenio,
         t.glicemia,
         t.peso,
         t.altura,
         t.classificacao_risco,
         t.observacoes,
         t.criado_em
       FROM consultas c
       INNER JOIN triagens t
         ON t.paciente_id = c.paciente_id
        AND t.consulta_id = c.id
       INNER JOIN pacientes p ON p.id = t.paciente_id
       INNER JOIN enfermeiros e ON e.id = t.enfermeiro_id
       WHERE c.id = ?
         AND c.medico_id = ?
       LIMIT 1`,
      [id, req.medico.id]
    );

    if (triagens.length === 0) {
      return res.status(404).json({
        mensagem: "Triagem não encontrada para esta consulta."
      });
    }

    return res.status(200).json(triagens[0]);
  } catch (error) {
    return next(error);
  }
}
