
import { pool } from "../config/database.js";

const STATUS_VALIDOS = [
    "solicitado",
    "agendado",
    "em_andamento",
    "concluido",
    "cancelado"
];

function criarErro(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
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
    complemento = null
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
        (
            paciente_id,
            unidade_id,
            motivo,
            rua,
            numero,
            bairro,
            cep,
            complemento
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            pacienteId,
            unidadeId,
            motivo,
            rua,
            numero,
            bairro,
            cep,
            complemento
        ]
    );

    return {
        id: resultado.insertId,
        paciente_id: pacienteId,
        unidade_id: unidadeId,
        status: "solicitado",
        mensagem: "Solicitação de atendimento domiciliar realizada."
    };
}

// Paciente consulta suas solicitações.
export async function listarAtendimentosDoPaciente(pacienteId) {
    const [atendimentos] = await pool.query(
        `SELECT
            ad.id,
            ad.unidade_id,
            u.nome AS unidade,
            ad.medico_id,
            m.nome_completo AS medico,
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
            u.nome AS unidade,
            m.nome_completo AS medico
        FROM atendimentos_domiciliares ad
        INNER JOIN pacientes p ON p.id = ad.paciente_id
        INNER JOIN unidades u ON u.id = ad.unidade_id
        LEFT JOIN medicos m ON m.id = ad.medico_id
        WHERE ad.id = ?`,
        [id]
    );

    if (atendimentos.length === 0) {
        throw criarErro("Atendimento domiciliar não encontrado.", 404);
    }

    return atendimentos[0];
}

// Lista solicitações da unidade.
export async function listarAtendimentosDaUnidade(unidadeId) {
    const [atendimentos] = await pool.query(
        `SELECT
            ad.id,
            ad.paciente_id,
            p.nome_completo AS paciente,
            p.telefone,
            ad.medico_id,
            m.nome_completo AS medico,
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
        LEFT JOIN medicos m ON m.id = ad.medico_id
        WHERE ad.unidade_id = ?
        ORDER BY
            FIELD(
                ad.status,
                'solicitado',
                'agendado',
                'em_andamento',
                'concluido',
                'cancelado'
            ),
            ad.data_solicitacao ASC`,
        [unidadeId]
    );

    return atendimentos;
}

// Agenda o atendimento e designa um médico.
export async function agendarAtendimentoDomiciliar({
    id,
    unidadeId,
    medicoId,
    dataAgendada
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
            throw criarErro(
                "Somente solicitações pendentes podem ser agendadas.",
                409
            );
        }

        const [medicos] = await conexao.query(
            `SELECT id
            FROM medicos
            WHERE id = ? AND ativo = TRUE`,
            [medicoId]
        );

        if (medicos.length === 0) {
            throw criarErro("Médico não encontrado ou inativo.", 404);
        }

        const [vinculos] = await conexao.query(
            `SELECT medico_id
            FROM medico_unidade_setores
            WHERE medico_id = ? AND unidade_id = ?`,
            [medicoId, unidadeId]
        );

        if (vinculos.length === 0) {
            throw criarErro(
                "O médico não está vinculado a essa unidade.",
                400
            );
        }

        if (!dataAgendada || Number.isNaN(Date.parse(dataAgendada))) {
            throw criarErro("Data de agendamento inválida.", 400);
        }

        const data = new Date(dataAgendada);

        if (data <= new Date()) {
            throw criarErro("A data do atendimento deve ser futura.", 400);
        }

        await conexao.query(
            `UPDATE atendimentos_domiciliares
            SET medico_id = ?,
                data_agendada = ?,
                status = 'agendado'
            WHERE id = ?`,
            [medicoId, dataAgendada, id]
        );

        await conexao.commit();

        return {
            id: Number(id),
            medico_id: medicoId,
            data_agendada: dataAgendada,
            status: "agendado"
        };
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}

// Atualiza o andamento do atendimento.
export async function atualizarStatusAtendimentoDomiciliar({
    id,
    unidadeId,
    novoStatus,
    observacoes = null
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

        const transicoes = {
            solicitado: ["agendado", "cancelado"],
            agendado: ["em_andamento", "cancelado"],
            em_andamento: ["concluido", "cancelado"],
            concluido: [],
            cancelado: []
        };

        if (!transicoes[statusAtual].includes(novoStatus)) {
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
            status: novoStatus
        };
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

        return {
            id: Number(id),
            status: "cancelado"
        };
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}
