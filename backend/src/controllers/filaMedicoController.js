
import { pool } from "../config/database.js";

export async function listarFilaDoMedico(req, res, next) {
  try {
    const medicoId = Number(req.medico?.id);

    if (!Number.isInteger(medicoId) || medicoId <= 0) {
      return res.status(401).json({
        mensagem: "Médico não autenticado."
      });
    }

    const [filas] = await pool.query(
      `SELECT
         f.id,
         f.paciente_id,
         p.nome_completo AS paciente,
         p.cpf AS paciente_cpf,
         p.data_nascimento AS paciente_data_nascimento,
         p.telefone AS paciente_telefone,
         f.unidade_id,
         u.nome AS unidade,
         f.setor_id,
         s.nome AS setor,
         f.consulta_id,
         f.medico_id,
         m.nome_completo AS medico_responsavel,
         f.status,
         f.prioridade,
         f.posicao,
         f.entrada_em,
         f.chamada_em,
         f.inicio_atendimento_em,
         f.fim_atendimento_em,
         f.checkin_realizado,
         f.checkin_em,
         t.id AS triagem_id,
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
         t.observacoes AS observacoes_triagem,
         t.criado_em AS triagem_criada_em
       FROM filas f
       INNER JOIN pacientes p ON p.id = f.paciente_id
       INNER JOIN unidades u ON u.id = f.unidade_id
       INNER JOIN setores s ON s.id = f.setor_id
       INNER JOIN medico_unidade_setores mus
         ON mus.unidade_id = f.unidade_id
        AND mus.setor_id = f.setor_id
        AND mus.medico_id = ?
       LEFT JOIN medicos m ON m.id = f.medico_id
       LEFT JOIN triagens t
         ON f.consulta_id IS NOT NULL
        AND t.consulta_id = f.consulta_id
       WHERE f.status IN (
         'aguardando',
         'chamado',
         'em_atendimento'
       )
       ORDER BY
         FIELD(f.status, 'em_atendimento', 'chamado', 'aguardando'),
         FIELD(
           COALESCE(t.classificacao_risco, f.prioridade),
           'vermelho', 'urgente', 'laranja',
           'amarelo', 'preferencial', 'verde',
           'azul', 'normal'
         ),
         f.entrada_em ASC,
         f.id ASC`,
      [medicoId]
    );

    return res.status(200).json({
      total: filas.length,
      filas
    });
  } catch (error) {
    return next(error);
  }
}

export async function atualizarStatusDaFila(req, res, next) {
  const conexao = await pool.getConnection();

  try {
    const filaId = String(req.params.id ?? "");
    const medicoId = Number(req.medico?.id);
    const { unidade_id, setor_id } = req.body ?? {};
    const novoStatus = req.body?.novo_status ?? req.body?.status;

    if (!/^[1-9]\d*$/.test(filaId)) {
      return res.status(400).json({
        mensagem: "ID da fila inválido."
      });
    }

    if (!Number.isInteger(medicoId) || medicoId <= 0) {
      return res.status(401).json({
        mensagem: "Médico não autenticado."
      });
    }

    if (
      !/^[1-9]\d*$/.test(String(unidade_id ?? "")) ||
      !/^[1-9]\d*$/.test(String(setor_id ?? ""))
    ) {
      return res.status(400).json({
        mensagem: "Unidade e setor da entrada são inválidos."
      });
    }

    const unidadeId = Number(unidade_id);
    const setorId = Number(setor_id);

    const permitidos = [
      "chamado",
      "em_atendimento",
      "concluido",
      "desistente",
      "cancelado"
    ];

    if (!permitidos.includes(novoStatus)) {
      return res.status(400).json({
        mensagem: "Status solicitado inválido."
      });
    }

    await conexao.beginTransaction();

    const [vinculos] = await conexao.query(
      `SELECT 1
       FROM medico_unidade_setores
       WHERE medico_id = ?
         AND unidade_id = ?
         AND setor_id = ?
       LIMIT 1`,
      [medicoId, unidadeId, setorId]
    );

    if (vinculos.length === 0) {
      await conexao.rollback();

      return res.status(403).json({
        mensagem: "Você não possui vínculo com este setor desta unidade."
      });
    }

    const [registros] = await conexao.query(
      `SELECT id, status, medico_id
       FROM filas
       WHERE id = ?
         AND unidade_id = ?
         AND setor_id = ?
       FOR UPDATE`,
      [Number(filaId), unidadeId, setorId]
    );

    if (registros.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Entrada de fila não encontrada."
      });
    }

    const fila = registros[0];

    const transicoes = {
      aguardando: ["chamado", "desistente", "cancelado"],
      chamado: ["em_atendimento", "desistente", "cancelado"],
      em_atendimento: ["concluido", "desistente"],
      concluido: [],
      desistente: [],
      cancelado: []
    };

    if (!transicoes[fila.status]?.includes(novoStatus)) {
      await conexao.rollback();

      return res.status(409).json({
        mensagem: `Não é possível alterar o status de "${fila.status}" para "${novoStatus}".`
      });
    }

    if (
      fila.medico_id !== null &&
      ["em_atendimento", "concluido", "desistente"].includes(novoStatus) &&
      Number(fila.medico_id) !== medicoId
    ) {
      await conexao.rollback();

      return res.status(403).json({
        mensagem: "Este paciente está atribuído a outro médico."
      });
    }

    await conexao.query(
      `UPDATE filas
       SET status = ?,
           medico_id = CASE
             WHEN ? = 'em_atendimento' THEN ?
             ELSE medico_id
           END,
           posicao = CASE
             WHEN ? IN ('concluido', 'desistente', 'cancelado')
             THEN NULL
             ELSE posicao
           END,
           chamada_em = CASE
             WHEN ? = 'chamado' THEN NOW()
             ELSE chamada_em
           END,
           inicio_atendimento_em = CASE
             WHEN ? = 'em_atendimento' THEN NOW()
             ELSE inicio_atendimento_em
           END,
           fim_atendimento_em = CASE
             WHEN ? IN ('concluido', 'desistente', 'cancelado')
             THEN NOW()
             ELSE fim_atendimento_em
           END
       WHERE id = ?`,
      [
        novoStatus,
        novoStatus,
        medicoId,
        novoStatus,
        novoStatus,
        novoStatus,
        novoStatus,
        Number(filaId)
      ]
    );

    const [ativas] = await conexao.query(
      `SELECT id
       FROM filas
       WHERE unidade_id = ?
         AND setor_id = ?
         AND status IN (
           'aguardando',
           'chamado',
           'em_atendimento'
         )
       ORDER BY
         FIELD(status, 'em_atendimento', 'chamado', 'aguardando'),
         FIELD(prioridade, 'urgente', 'preferencial', 'normal'),
         entrada_em ASC,
         id ASC
       FOR UPDATE`,
      [unidadeId, setorId]
    );

    for (let i = 0; i < ativas.length; i += 1) {
      await conexao.query(
        "UPDATE filas SET posicao = ? WHERE id = ?",
        [i + 1, ativas[i].id]
      );
    }

    await conexao.commit();

    return res.status(200).json({
      mensagem: "Status da fila atualizado com sucesso.",
      fila: {
        id: Number(filaId),
        status_anterior: fila.status,
        status: novoStatus,
        medico_id:
          novoStatus === "em_atendimento"
            ? medicoId
            : fila.medico_id
      }
    });
  } catch (error) {
    try {
      await conexao.rollback();
    } catch {}

    return next(error);
  } finally {
    conexao.release();
  }
}
