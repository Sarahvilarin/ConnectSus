
import { pool } from "../config/database.js";

const STATUS_EXAME = [
  "solicitado",
  "agendado",
  "em_andamento",
  "concluido",
  "cancelado"
];

function idValido(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

function validarIdParametro(id, res) {
  if (!idValido(id)) {
    res.status(400).json({ mensagem: "ID inválido." });
    return false;
  }
  return true;
}

// Paciente solicita um exame
export async function solicitarExame(req, res, next) {
  try {
    const pacienteId = req.paciente.id;
    const {
      medico_id,
      unidade_id,
      consulta_id = null,
      tipo_exame,
      observacoes = null
    } = req.body ?? {};

    if (
      !Number.isSafeInteger(medico_id) ||
      medico_id < 1 ||
      !Number.isSafeInteger(unidade_id) ||
      unidade_id < 1 ||
      (consulta_id !== null &&
        (!Number.isSafeInteger(consulta_id) || consulta_id < 1)) ||
      typeof tipo_exame !== "string" ||
      tipo_exame.trim().length < 3 ||
      tipo_exame.trim().length > 150 ||
      (observacoes !== null &&
        (typeof observacoes !== "string" || observacoes.length > 1000))
    ) {
      return res.status(400).json({
        mensagem: "Informe médico, unidade e tipo de exame válidos."
      });
    }

    const [medicos] = await pool.query(
      "SELECT id FROM medicos WHERE id = ? AND ativo = TRUE",
      [medico_id]
    );

    if (!medicos.length) {
      return res.status(404).json({
        mensagem: "Médico não encontrado ou desativado."
      });
    }

    const [unidades] = await pool.query(
      "SELECT id FROM unidades WHERE id = ? AND ativo = TRUE",
      [unidade_id]
    );

    if (!unidades.length) {
      return res.status(404).json({
        mensagem: "Unidade não encontrada ou desativada."
      });
    }

    if (consulta_id !== null) {
      const [consultas] = await pool.query(
        `SELECT id
         FROM consultas
         WHERE id = ?
           AND paciente_id = ?
           AND medico_id = ?
           AND unidade_id = ?
           AND status IN ('pendente', 'confirmada', 'concluida')`,
        [consulta_id, pacienteId, medico_id, unidade_id]
      );

      if (!consultas.length) {
        return res.status(400).json({
          mensagem: "A consulta informada não corresponde ao paciente, médico e unidade."
        });
      }
    }

    const [resultado] = await pool.query(
      `INSERT INTO exames
       (paciente_id, medico_id, unidade_id, consulta_id, tipo_exame, observacoes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        pacienteId,
        medico_id,
        unidade_id,
        consulta_id,
        tipo_exame.trim(),
        observacoes?.trim() || null
      ]
    );

    return res.status(201).json({
      mensagem: "Exame solicitado com sucesso.",
      exame: {
        id: resultado.insertId,
        paciente_id: pacienteId,
        medico_id,
        unidade_id,
        consulta_id,
        tipo_exame: tipo_exame.trim(),
        status: "solicitado"
      }
    });
  } catch (error) {
    next(error);
  }
}

// Paciente lista apenas os próprios exames
export async function listarMeusExames(req, res, next) {
  try {
    const [exames] = await pool.query(
      `SELECT e.id, e.tipo_exame, e.observacoes, e.status,
              e.data_agendada, e.resultado, e.data_resultado,
              e.criado_em, e.consulta_id,
              m.nome_completo AS medico,
              u.nome AS unidade
       FROM exames e
       INNER JOIN medicos m ON m.id = e.medico_id
       INNER JOIN unidades u ON u.id = e.unidade_id
       WHERE e.paciente_id = ?
       ORDER BY e.criado_em DESC`,
      [req.paciente.id]
    );

    return res.status(200).json(exames);
  } catch (error) {
    next(error);
  }
}

// Médico lista apenas os exames sob sua responsabilidade
export async function listarExamesDoMedico(req, res, next) {
  try {
    const [exames] = await pool.query(
      `SELECT e.id, e.paciente_id, p.nome_completo AS paciente,
              p.cpf, e.tipo_exame, e.observacoes, e.status,
              e.data_agendada, e.resultado, e.data_resultado,
              e.criado_em, e.consulta_id, u.nome AS unidade
       FROM exames e
       INNER JOIN pacientes p ON p.id = e.paciente_id
       INNER JOIN unidades u ON u.id = e.unidade_id
       WHERE e.medico_id = ?
       ORDER BY e.criado_em DESC`,
      [req.medico.id]
    );

    return res.status(200).json(exames);
  } catch (error) {
    next(error);
  }
}

// Administrador lista todos os exames
export async function listarExames(req, res, next) {
  try {
    const [exames] = await pool.query(
      `SELECT e.id, e.paciente_id, p.nome_completo AS paciente,
              e.medico_id, m.nome_completo AS medico,
              e.unidade_id, u.nome AS unidade,
              e.consulta_id, e.tipo_exame, e.observacoes,
              e.status, e.data_agendada, e.resultado,
              e.data_resultado, e.criado_em
       FROM exames e
       INNER JOIN pacientes p ON p.id = e.paciente_id
       INNER JOIN medicos m ON m.id = e.medico_id
       INNER JOIN unidades u ON u.id = e.unidade_id
       ORDER BY e.criado_em DESC`
    );

    return res.status(200).json(exames);
  } catch (error) {
    next(error);
  }
}

// Médico atualiza status do exame
export async function atualizarStatusExame(req, res, next) {
  try {
    const { id } = req.params;
    const { status, data_agendada } = req.body ?? {};

    if (!validarIdParametro(id, res)) return;

    if (!["agendado", "em_andamento", "concluido", "cancelado"].includes(status)) {
      return res.status(400).json({
        mensagem: "Status de exame inválido."
      });
    }

    if (
      data_agendada !== undefined &&
      data_agendada !== null &&
      (typeof data_agendada !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(data_agendada) ||
        Number.isNaN(Date.parse(data_agendada)))
    ) {
      return res.status(400).json({
        mensagem: "Data agendada inválida."
      });
    }

    const [exames] = await pool.query(
      "SELECT id, status FROM exames WHERE id = ? AND medico_id = ?",
      [id, req.medico.id]
    );

    if (!exames.length) {
      return res.status(404).json({
        mensagem: "Exame não encontrado."
      });
    }

    const statusAtual = exames[0].status;
    const transicoes = {
      solicitado: ["agendado", "cancelado"],
      agendado: ["em_andamento", "cancelado"],
      em_andamento: ["concluido", "cancelado"],
      concluido: [],
      cancelado: []
    };

    if (!transicoes[statusAtual].includes(status)) {
      return res.status(409).json({
        mensagem: `Não é possível alterar o status de "${statusAtual}" para "${status}".`
      });
    }

    const dataAgendadaSql = data_agendada
      ? data_agendada.replace("T", " ").slice(0, 19)
      : null;

    await pool.query(
      `UPDATE exames
       SET status = ?,
           data_agendada = COALESCE(?, data_agendada),
           data_resultado = CASE WHEN ? = 'concluido' THEN NOW() ELSE data_resultado END
       WHERE id = ? AND medico_id = ?`,
      [status, dataAgendadaSql, status, id, req.medico.id]
    );

    return res.status(200).json({
      mensagem: "Status do exame atualizado com sucesso.",
      status
    });
  } catch (error) {
    next(error);
  }
}

// Médico registra o resultado de um exame concluído
export async function registrarResultadoExame(req, res, next) {
  try {
    const { id } = req.params;
    const { resultado } = req.body ?? {};

    if (!validarIdParametro(id, res)) return;

    if (
      typeof resultado !== "string" ||
      resultado.trim().length < 1 ||
      resultado.trim().length > 20000
    ) {
      return res.status(400).json({
        mensagem: "Informe um resultado de até 20.000 caracteres."
      });
    }

    const [exames] = await pool.query(
      "SELECT id, status FROM exames WHERE id = ? AND medico_id = ?",
      [id, req.medico.id]
    );

    if (!exames.length) {
      return res.status(404).json({
        mensagem: "Exame não encontrado."
      });
    }

    if (exames[0].status !== "concluido") {
      return res.status(409).json({
        mensagem: "O resultado só pode ser registrado após a conclusão do exame."
      });
    }

    await pool.query(
      `UPDATE exames
       SET resultado = ?, data_resultado = COALESCE(data_resultado, NOW())
       WHERE id = ? AND medico_id = ?`,
      [resultado.trim(), id, req.medico.id]
    );

    return res.status(200).json({
      mensagem: "Resultado registrado com sucesso."
    });
  } catch (error) {
    next(error);
  }
}

// Administrador consulta um exame pelo ID
export async function buscarExame(req, res, next) {
  try {
    const { id } = req.params;

    if (!validarIdParametro(id, res)) return;

    const [exames] = await pool.query(
      `SELECT e.id, e.paciente_id, p.nome_completo AS paciente,
              e.medico_id, m.nome_completo AS medico,
              e.unidade_id, u.nome AS unidade,
              e.consulta_id, e.tipo_exame, e.observacoes,
              e.status, e.data_agendada, e.resultado,
              e.data_resultado, e.criado_em
       FROM exames e
       INNER JOIN pacientes p ON p.id = e.paciente_id
       INNER JOIN medicos m ON m.id = e.medico_id
       INNER JOIN unidades u ON u.id = e.unidade_id
       WHERE e.id = ?`,
      [id]
    );

    if (!exames.length) {
      return res.status(404).json({
        mensagem: "Exame não encontrado."
      });
    }

    return res.status(200).json(exames[0]);
  } catch (error) {
    next(error);
  }
}
