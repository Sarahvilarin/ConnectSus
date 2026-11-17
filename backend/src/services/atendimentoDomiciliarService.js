import { pool } from "../config/database.js";

const STATUS_VALIDOS = [
  "solicitado",
  "agendado",
  "em_andamento",
  "concluido",
  "cancelado",
];

const TRANSICOES_STATUS = {
  solicitado: ["agendado", "cancelado"],
  agendado: ["em_andamento", "cancelado"],
  em_andamento: ["concluido", "cancelado"],
  concluido: [],
  cancelado: [],
};

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarDataAgendada(dataAgendada) {
  if (!dataAgendada || Number.isNaN(Date.parse(dataAgendada))) {
    throw criarErro("Data de agendamento inválida.", 400);
  }

  if (new Date(dataAgendada) <= new Date()) {
    throw criarErro("A data do atendimento deve ser futura.", 400);
  }
}

// Paciente solicita atendimento domiciliar.
export async function solicitarAtendimentoDomiciliar({
  pacienteId,
  unidadeId,
  motivo,
  rua,
  numero,
  bairro,
  cep,
  complemento = null,
}) {
  const [pacientes] = await pool.query(
    "SELECT id FROM pacientes WHERE id = ? AND ativo = TRUE",
    [pacienteId]
  );

  if (pacientes.length === 0) {
    throw criarErro("Paciente não encontrado ou inativo.", 404);
  }

  const [unidades] = await pool.query(
    "SELECT id FROM unidades WHERE id = ? AND ativo = TRUE",
    [unidadeId]
  );

  if (unidades.length === 0) {
    throw criarErro("Unidade não encontrada ou inativa.", 404);
  }

  const [resultado] = await pool.query(
    `INSERT INTO atendimentos_domiciliares
      (paciente_id, unidade_id, motivo, rua, numero, bairro, cep, complemento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [pacienteId, unidadeId, motivo, rua, numero, bairro, cep, complemento]
  );

  return {
    id: resultado.insertId,
    paciente_id: pacienteId,
    unidade_id: unidadeId,
    status: "solicitado",
    mensagem: "Solicitação de atendimento domiciliar realizada.",
  };
}

// Paciente consulta suas próprias solicitações.
export async function listarAtendimentosDoPaciente(pacienteId) {
  const [atendimentos] = await pool.query(
    `SELECT
       ad.id,
       ad.unidade_id,
       u.nome AS unidade,
       ad.medico_id,
       m.nome_completo AS medico,
       ad.enfermeiro_id,
       e.nome_completo AS enfermeiro,
       ad.motivo,
       ad.rua,
       ad.numero,
       ad.bairro,
       ad.cep,
       ad.complemento,
       ad.data_solicitacao,
       ad.data_agendada,
       ad.data_conclusao,
       ad.status,
       ad.observacoes
     FROM atendimentos_domiciliares ad
     INNER JOIN unidades u ON u.id = ad.unidade_id
     LEFT JOIN medicos m ON m.id = ad.medico_id
     LEFT JOIN enfermeiros e ON e.id = ad.enfermeiro_id
     WHERE ad.paciente_id = ?
     ORDER BY ad.data_solicitacao DESC`,
    [pacienteId]
  );

  return atendimentos;
}

// Consulta os detalhes de uma solicitação.
export async function buscarAtendimentoDomiciliar(id) {
  const [atendimentos] = await pool.query(
    `SELECT
       ad.*,
       p.nome_completo AS paciente,
       p.telefone,
       u.nome AS unidade,
       m.nome_completo AS medico,
       e.nome_completo AS enfermeiro
     FROM atendimentos_domiciliares ad
     INNER JOIN pacientes p ON p.id = ad.paciente_id
     INNER JOIN unidades u ON u.id = ad.unidade_id
     LEFT JOIN medicos m ON m.id = ad.medico_id
     LEFT JOIN enfermeiros e ON e.id = ad.enfermeiro_id
     WHERE ad.id = ?`,
    [id]
  );

  if (atendimentos.length === 0) {
    throw criarErro("Atendimento domiciliar não encontrado.", 404);
  }

  return atendimentos[0];
}

// Lista solicitações de uma unidade (mantida para compatibilidade interna).
export async function listarAtendimentosDaUnidade(unidadeId) {
  const [atendimentos] = await pool.query(
    `SELECT
       ad.id,
       ad.unidade_id,
       u.nome AS unidade,
       ad.paciente_id,
       p.nome_completo AS paciente,
       p.telefone,
       ad.medico_id,
       m.nome_completo AS medico,
       ad.enfermeiro_id,
       e.nome_completo AS enfermeiro,
       ad.motivo,
       ad.rua,
       ad.numero,
       ad.bairro,
       ad.cep,
       ad.complemento,
       ad.data_solicitacao,
       ad.data_agendada,
       ad.data_conclusao,
       ad.status,
       ad.observacoes
     FROM atendimentos_domiciliares ad
     INNER JOIN pacientes p ON p.id = ad.paciente_id
     INNER JOIN unidades u ON u.id = ad.unidade_id
     LEFT JOIN medicos m ON m.id = ad.medico_id
     LEFT JOIN enfermeiros e ON e.id = ad.enfermeiro_id
     WHERE ad.unidade_id = ?
     ORDER BY
       FIELD(ad.status, 'solicitado', 'agendado', 'em_andamento', 'concluido', 'cancelado'),
       ad.data_solicitacao ASC`,
    [unidadeId]
  );

  return atendimentos;
}

// Administrador consulta as solicitações e visitas de todas as unidades.
export async function listarTodosAtendimentosDomiciliares() {
  const [atendimentos] = await pool.query(
    `SELECT
       ad.id,
       ad.unidade_id,
       u.nome AS unidade,
       ad.paciente_id,
       p.nome_completo AS paciente,
       p.telefone,
       ad.medico_id,
       m.nome_completo AS medico,
       ad.enfermeiro_id,
       e.nome_completo AS enfermeiro,
       e.coren,
       e.uf_coren,
       ad.motivo,
       ad.rua,
       ad.numero,
       ad.bairro,
       ad.cep,
       ad.complemento,
       ad.data_solicitacao,
       ad.data_agendada,
       ad.data_conclusao,
       ad.status,
       ad.observacoes
     FROM atendimentos_domiciliares ad
     INNER JOIN pacientes p ON p.id = ad.paciente_id
     INNER JOIN unidades u ON u.id = ad.unidade_id
     LEFT JOIN medicos m ON m.id = ad.medico_id
     LEFT JOIN enfermeiros e ON e.id = ad.enfermeiro_id
     ORDER BY
       FIELD(ad.status, 'solicitado', 'agendado', 'em_andamento', 'concluido', 'cancelado'),
       ad.data_solicitacao ASC`
  );

  return atendimentos;
}

// Lista todos os enfermeiros ativos. A seleção administrativa não é limitada por unidade.
export async function listarEnfermeirosAtivos() {
  const [enfermeiros] = await pool.query(
    `SELECT id, nome_completo, coren, uf_coren
     FROM enfermeiros
     WHERE ativo = TRUE
     ORDER BY nome_completo ASC`
  );

  return enfermeiros;
}

// Cada enfermeiro consulta somente os atendimentos atribuídos ao próprio cadastro.
export async function listarAtendimentosDoEnfermeiro(enfermeiroId) {
  const [atendimentos] = await pool.query(
    `SELECT
       ad.id,
       ad.paciente_id,
       p.nome_completo AS paciente,
       p.telefone,
       ad.unidade_id,
       u.nome AS unidade,
       ad.enfermeiro_id,
       e.nome_completo AS enfermeiro,
       ad.motivo,
       ad.rua,
       ad.numero,
       ad.bairro,
       ad.cep,
       ad.complemento,
       ad.data_solicitacao,
       ad.data_agendada,
       ad.data_conclusao,
       ad.status,
       ad.observacoes
     FROM atendimentos_domiciliares ad
     INNER JOIN pacientes p ON p.id = ad.paciente_id
     INNER JOIN unidades u ON u.id = ad.unidade_id
     INNER JOIN enfermeiros e ON e.id = ad.enfermeiro_id
     WHERE ad.enfermeiro_id = ?
     ORDER BY
       FIELD(ad.status, 'agendado', 'em_andamento', 'concluido', 'cancelado', 'solicitado'),
       ad.data_agendada ASC,
       ad.data_solicitacao DESC`,
    [enfermeiroId]
  );

  return atendimentos;
}

// O administrador pode agendar solicitações e reatribuir visitas já agendadas.
export async function agendarAtendimentoDomiciliarAdmin({
  id,
  enfermeiroId,
  dataAgendada,
}) {
  if (!Number.isInteger(Number(enfermeiroId)) || Number(enfermeiroId) <= 0) {
    throw criarErro("Selecione um enfermeiro responsável pela visita.", 400);
  }

  validarDataAgendada(dataAgendada);

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Atendimento domiciliar não encontrado.", 404);
    }

    const atendimento = atendimentos[0];

    if (!["solicitado", "agendado"].includes(atendimento.status)) {
      throw criarErro(
        "Somente solicitações pendentes ou visitas já agendadas podem ser agendadas ou reatribuídas.",
        409
      );
    }

    const [enfermeiros] = await conexao.query(
      `SELECT id
       FROM enfermeiros
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [enfermeiroId]
    );

    if (enfermeiros.length === 0) {
      throw criarErro("Enfermeiro não encontrado ou inativo.", 404);
    }

    const novoStatus = atendimento.status === "solicitado" ? "agendado" : atendimento.status;

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET enfermeiro_id = ?, data_agendada = ?, status = ?
       WHERE id = ?`,
      [Number(enfermeiroId), dataAgendada, novoStatus, id]
    );

    await conexao.commit();

    return {
      id: Number(id),
      enfermeiro_id: Number(enfermeiroId),
      data_agendada: dataAgendada,
      status: novoStatus,
    };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

// Atualiza status de uma visita selecionada pelo administrador.
export async function atualizarStatusAtendimentoDomiciliarAdmin({
  id,
  novoStatus,
  observacoes = null,
}) {
  if (novoStatus !== "cancelado") {
    throw criarErro("O administrador pode cancelar a visita. O andamento deve ser atualizado pelo enfermeiro responsável.", 403);
  }

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Atendimento domiciliar não encontrado.", 404);
    }

    const statusAtual = atendimentos[0].status;
    if (!TRANSICOES_STATUS[statusAtual]?.includes(novoStatus)) {
      throw criarErro(
        `Não é possível alterar o status de "${statusAtual}" para "${novoStatus}".`,
        409
      );
    }

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET status = ?,
           observacoes = COALESCE(?, observacoes),
           data_conclusao = CASE
             WHEN ? = 'concluido' THEN NOW()
             ELSE data_conclusao
           END
       WHERE id = ?`,
      [novoStatus, observacoes, novoStatus, id]
    );

    await conexao.commit();

    return {
      id: Number(id),
      status_anterior: statusAtual,
      status: novoStatus,
    };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

// O enfermeiro só pode atualizar visitas atribuídas ao seu próprio ID.
export async function atualizarStatusAtendimentoDomiciliarEnfermeiro({
  id,
  enfermeiroId,
  novoStatus,
  observacoes = null,
}) {
  const transicoesPermitidas = {
    agendado: ["em_andamento"],
    em_andamento: ["concluido"],
  };

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ? AND enfermeiro_id = ?
       FOR UPDATE`,
      [id, enfermeiroId]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Visita não encontrada ou não atribuída ao seu cadastro.", 404);
    }

    const statusAtual = atendimentos[0].status;
    if (!transicoesPermitidas[statusAtual]?.includes(novoStatus)) {
      throw criarErro(
        "Não é possível realizar essa alteração de status para esta visita.",
        409
      );
    }

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET status = ?,
           observacoes = COALESCE(?, observacoes),
           data_conclusao = CASE WHEN ? = 'concluido' THEN NOW() ELSE data_conclusao END
       WHERE id = ? AND enfermeiro_id = ?`,
      [novoStatus, observacoes, novoStatus, id, enfermeiroId]
    );

    await conexao.commit();

    return {
      id: Number(id),
      status_anterior: statusAtual,
      status: novoStatus,
    };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

// Mantém a função original de agendamento por unidade para usos existentes.
export async function agendarAtendimentoDomiciliar({
  id,
  unidadeId,
  medicoId,
  dataAgendada,
}) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ? AND unidade_id = ?
       FOR UPDATE`,
      [id, unidadeId]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Atendimento domiciliar não encontrado nessa unidade.", 404);
    }

    if (atendimentos[0].status !== "solicitado") {
      throw criarErro("Somente solicitações pendentes podem ser agendadas.", 409);
    }

    const [vinculos] = await conexao.query(
      `SELECT m.id
       FROM medicos m
       INNER JOIN medico_unidade_setores mus ON mus.medico_id = m.id
       WHERE m.id = ? AND m.ativo = TRUE AND mus.unidade_id = ?
       LIMIT 1`,
      [medicoId, unidadeId]
    );

    if (vinculos.length === 0) {
      throw criarErro("O médico não está ativo ou vinculado a essa unidade.", 400);
    }

    validarDataAgendada(dataAgendada);

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET medico_id = ?, data_agendada = ?, status = 'agendado'
       WHERE id = ?`,
      [medicoId, dataAgendada, id]
    );

    await conexao.commit();

    return {
      id: Number(id),
      medico_id: Number(medicoId),
      data_agendada: dataAgendada,
      status: "agendado",
    };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

// Mantém a função original de atualização por unidade para usos existentes.
export async function atualizarStatusAtendimentoDomiciliar({
  id,
  unidadeId,
  novoStatus,
  observacoes = null,
}) {
  if (!STATUS_VALIDOS.includes(novoStatus)) {
    throw criarErro("Status informado inválido.", 400);
  }

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ? AND unidade_id = ?
       FOR UPDATE`,
      [id, unidadeId]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Atendimento domiciliar não encontrado.", 404);
    }

    const statusAtual = atendimentos[0].status;
    if (!TRANSICOES_STATUS[statusAtual]?.includes(novoStatus)) {
      throw criarErro(
        `Não é possível alterar o status de "${statusAtual}" para "${novoStatus}".`,
        409
      );
    }

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET status = ?,
           observacoes = COALESCE(?, observacoes),
           data_conclusao = CASE WHEN ? = 'concluido' THEN NOW() ELSE data_conclusao END
       WHERE id = ?`,
      [novoStatus, observacoes, novoStatus, id]
    );

    await conexao.commit();

    return { id: Number(id), status_anterior: statusAtual, status: novoStatus };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}

// Paciente cancela sua própria solicitação.
export async function cancelarAtendimentoDoPaciente(pacienteId, id) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const [atendimentos] = await conexao.query(
      `SELECT id, status
       FROM atendimentos_domiciliares
       WHERE id = ? AND paciente_id = ?
       FOR UPDATE`,
      [id, pacienteId]
    );

    if (atendimentos.length === 0) {
      throw criarErro("Atendimento domiciliar não encontrado.", 404);
    }

    if (!["solicitado", "agendado"].includes(atendimentos[0].status)) {
      throw criarErro(
        "Não é possível cancelar um atendimento que já começou ou foi finalizado.",
        409
      );
    }

    await conexao.query(
      `UPDATE atendimentos_domiciliares
       SET status = 'cancelado'
       WHERE id = ?`,
      [id]
    );

    await conexao.commit();
    return { id: Number(id), status: "cancelado" };
  } catch (error) {
    await conexao.rollback();
    throw error;
  } finally {
    conexao.release();
  }
}
