
import { pool } from "../config/database.js";

const STATUS_ATIVOS = ["aguardando", "chamado", "em_atendimento"];

export async function entrarNaFila({
    pacienteId,
    unidadeId,
    setorId,
    consultaId = null,
    prioridade = "normal"
}) {
    const conexao = await pool.getConnection();

    try {
        await conexao.beginTransaction();

        // Confere se a unidade está ativa.
        const [unidades] = await conexao.query(
            "SELECT id FROM unidades WHERE id = ? AND ativo = TRUE FOR UPDATE",
            [unidadeId]
        );

        if (unidades.length === 0) {
            const erro = new Error("Unidade não encontrada ou desativada.");
            erro.status = 404;
            throw erro;
        }

        // Confere se o setor pertence à unidade e está disponível.
        const [setores] = await conexao.query(
            `SELECT us.setor_id
   FROM unidade_setores us
   WHERE us.unidade_id = ?
     AND us.setor_id = ?
   FOR UPDATE`,
            [unidadeId, setorId]
        );

        if (setores.length === 0) {
            const erro = new Error("Setor não disponível nessa unidade.");
            erro.status = 400;
            throw erro;
        }

        // Evita duas entradas ativas do mesmo paciente na mesma unidade e setor.
        const [filasExistentes] = await conexao.query(
            `SELECT id
       FROM filas
       WHERE paciente_id = ?
         AND unidade_id = ?
         AND setor_id = ?
         AND status IN ('aguardando', 'chamado', 'em_atendimento')
       LIMIT 1
       FOR UPDATE`,
            [pacienteId, unidadeId, setorId]
        );

        if (filasExistentes.length > 0) {
            const erro = new Error("Você já possui uma entrada ativa nessa fila.");
            erro.status = 409;
            throw erro;
        }

        // Se houver consulta, ela deve pertencer ao paciente e à unidade informados.
        if (consultaId !== null) {
            const [consultas] = await conexao.query(
                `SELECT id
         FROM consultas
         WHERE id = ?
           AND paciente_id = ?
           AND unidade_id = ?
           AND status = 'confirmada'`,
                [consultaId, pacienteId, unidadeId]
            );

            if (consultas.length === 0) {
                const erro = new Error(
                    "A consulta informada não pertence ao paciente ou não está confirmada nessa unidade."
                );
                erro.status = 400;
                throw erro;
            }
        }

        const [posicoes] = await conexao.query(
            `SELECT COALESCE(MAX(posicao), 0) + 1 AS proxima_posicao
       FROM filas
       WHERE unidade_id = ?
         AND setor_id = ?
         AND status IN ('aguardando', 'chamado', 'em_atendimento')`,
            [unidadeId, setorId]
        );

        const posicao = posicoes[0].proxima_posicao;

        const [resultado] = await conexao.query(
            `INSERT INTO filas
       (paciente_id, unidade_id, setor_id, consulta_id, prioridade, posicao)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [pacienteId, unidadeId, setorId, consultaId, prioridade, posicao]
        );

        await conexao.commit();

        return {
            id: resultado.insertId,
            paciente_id: pacienteId,
            unidade_id: unidadeId,
            setor_id: setorId,
            consulta_id: consultaId,
            prioridade,
            posicao,
            status: "aguardando"
        };
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}

export async function listarFilaPorUnidadeSetor(unidadeId, setorId) {
    const [filas] = await pool.query(
        `SELECT f.id, f.paciente_id,
            p.nome_completo AS paciente,
            f.unidade_id, f.setor_id, f.consulta_id,
            f.status, f.prioridade, f.posicao,
            f.entrada_em, f.chamada_em, f.inicio_atendimento_em
     FROM filas f
     INNER JOIN pacientes p ON p.id = f.paciente_id
     WHERE f.unidade_id = ?
       AND f.setor_id = ?
       AND f.status IN ('aguardando', 'chamado', 'em_atendimento')
     ORDER BY
       FIELD(f.status, 'em_atendimento', 'chamado', 'aguardando'),
       FIELD(f.prioridade, 'urgente', 'preferencial', 'normal'),
       f.entrada_em ASC,
       f.id ASC`,
        [unidadeId, setorId]
    );

    return filas;
}


export async function recalcularPosicoes(conexao, unidadeId, setorId) {
    // Remove posições antigas de entradas que já não estão ativas.
    await conexao.query(
        `UPDATE filas
         SET posicao = NULL
         WHERE unidade_id = ?
           AND setor_id = ?
           AND status NOT IN ('aguardando', 'chamado', 'em_atendimento')
           AND posicao IS NOT NULL`,
        [unidadeId, setorId]
    );

    // Busca as entradas ativas na ordem de atendimento.
    const [filas] = await conexao.query(
        `SELECT id
         FROM filas
         WHERE unidade_id = ?
           AND setor_id = ?
           AND status IN ('aguardando', 'chamado', 'em_atendimento')
         ORDER BY
           FIELD(status, 'em_atendimento', 'chamado', 'aguardando'),
           FIELD(prioridade, 'urgente', 'preferencial', 'normal'),
           entrada_em ASC,
           id ASC
         FOR UPDATE`,
        [unidadeId, setorId]
    );

    // Atualiza as posições sequencialmente.
    for (let i = 0; i < filas.length; i++) {
        await conexao.query(
            "UPDATE filas SET posicao = ? WHERE id = ?",
            [i + 1, filas[i].id]
        );
    }
}


export async function atualizarStatusFila({
    filaId,
    unidadeId,
    setorId,
    novoStatus
}) {
    const conexao = await pool.getConnection();

    try {
        await conexao.beginTransaction();

        const [filas] = await conexao.query(
            `SELECT id, status
       FROM filas
       WHERE id = ?
         AND unidade_id = ?
         AND setor_id = ?
       FOR UPDATE`,
            [filaId, unidadeId, setorId]
        );

        if (filas.length === 0) {
            const erro = new Error("Entrada de fila não encontrada.");
            erro.status = 404;
            throw erro;
        }

        const statusAtual = filas[0].status;

        const transicoes = {
            aguardando: ["chamado", "desistente", "cancelado"],
            chamado: ["em_atendimento", "desistente", "cancelado"],
            em_atendimento: ["concluido", "desistente"],
            concluido: [],
            desistente: [],
            cancelado: []
        };

        if (!transicoes[statusAtual].includes(novoStatus)) {
            const erro = new Error(
                `Não é possível alterar o status de "${statusAtual}" para "${novoStatus}".`
            );
            erro.status = 409;
            throw erro;
        }

        const agora = new Date();


        await conexao.query(
            `UPDATE filas
   SET status = ?,
       posicao = CASE
         WHEN ? IN ('concluido', 'desistente', 'cancelado') THEN NULL
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
         WHEN ? IN ('concluido', 'desistente', 'cancelado') THEN NOW()
         ELSE fim_atendimento_em
       END
   WHERE id = ?`,
            [novoStatus, novoStatus, novoStatus, novoStatus, novoStatus, filaId]
        );

        // Recalcula as posições das entradas que continuam ativas.
        await recalcularPosicoes(conexao, unidadeId, setorId);


        await conexao.commit();

        return {
            id: Number(filaId),
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

export async function listarFilasDoPaciente(pacienteId) {
    const [filas] = await pool.query(
        `SELECT f.id, f.unidade_id, u.nome AS unidade,
            f.setor_id, s.nome AS setor,
            f.consulta_id, f.status, f.prioridade,
            f.posicao, f.entrada_em, f.chamada_em,
            f.inicio_atendimento_em, f.fim_atendimento_em
     FROM filas f
     INNER JOIN unidades u ON u.id = f.unidade_id
     INNER JOIN setores s ON s.id = f.setor_id
     WHERE f.paciente_id = ?
     ORDER BY f.entrada_em DESC`,
        [pacienteId]
    );

    return filas;
}

export async function cancelarEntradaDoPaciente(pacienteId, filaId) {
    const conexao = await pool.getConnection();

    try {
        await conexao.beginTransaction();

        const [filas] = await conexao.query(
            `SELECT id, unidade_id, setor_id, status
       FROM filas
       WHERE id = ? AND paciente_id = ?
       FOR UPDATE`,
            [filaId, pacienteId]
        );

        if (filas.length === 0) {
            const erro = new Error("Entrada de fila não encontrada.");
            erro.status = 404;
            throw erro;
        }

        const fila = filas[0];

        if (!["aguardando", "chamado"].includes(fila.status)) {
            const erro = new Error(
                "Só é possível cancelar uma entrada que esteja aguardando ou tenha sido chamada."
            );
            erro.status = 409;
            throw erro;
        }

        await conexao.query(
            "UPDATE filas SET status = 'cancelado', posicao = NULL, fim_atendimento_em = NOW() WHERE id = ?",
            [filaId]
        );

        await recalcularPosicoes(conexao, fila.unidade_id, fila.setor_id);

        await conexao.commit();

        return {
            id: Number(filaId),
            status: "cancelado"
        };
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}


export async function calcularEstimativaEspera(filaId, pacienteId) {
    // Busca a entrada do próprio paciente.
    const [entradas] = await pool.query(
        `SELECT id, unidade_id, setor_id, status
     FROM filas
     WHERE id = ? AND paciente_id = ?`,
        [filaId, pacienteId]
    );

    if (entradas.length === 0) {
        return null;
    }

    const entrada = entradas[0];

    // Entradas finalizadas não precisam de previsão de espera.
    if (
        !["aguardando", "chamado", "em_atendimento"].includes(
            entrada.status
        )
    ) {
        return {
            pessoas_a_frente: null,
            tempo_estimado_minutos: null,
            media_atendimento_minutos: null,
            motivo: "O atendimento não está ativo."
        };
    }

    // Obtém a ordem atual da fila.
    const [filaAtiva] = await pool.query(
        `SELECT id, status
     FROM filas
     WHERE unidade_id = ?
       AND setor_id = ?
       AND status IN ('aguardando', 'chamado', 'em_atendimento')
     ORDER BY
       FIELD(status, 'em_atendimento', 'chamado', 'aguardando'),
       FIELD(prioridade, 'urgente', 'preferencial', 'normal'),
       entrada_em ASC,
       id ASC`,
        [entrada.unidade_id, entrada.setor_id]
    );

    const indice = filaAtiva.findIndex(
        (item) => item.id === entrada.id
    );

    if (indice === -1) {
        return null;
    }

    const pessoasAFrente = indice;

    // Média dos atendimentos concluídos nos últimos 30 dias.
    const [historico] = await pool.query(
        `SELECT AVG(TIMESTAMPDIFF(
       SECOND,
       inicio_atendimento_em,
       fim_atendimento_em
     )) AS media_segundos
     FROM filas
     WHERE unidade_id = ?
       AND setor_id = ?
       AND status = 'concluido'
       AND inicio_atendimento_em IS NOT NULL
       AND fim_atendimento_em IS NOT NULL
       AND fim_atendimento_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       AND fim_atendimento_em > inicio_atendimento_em`,
        [entrada.unidade_id, entrada.setor_id]
    );

    // Até existir histórico, usamos 15 minutos como referência inicial.
    const mediaSegundos = Number(historico[0]?.media_segundos);
    const mediaMinutos =
        Number.isFinite(mediaSegundos) && mediaSegundos > 0
            ? Math.max(5, Math.round(mediaSegundos / 60))
            : 15;

    return {
        pessoas_a_frente: pessoasAFrente,
        tempo_estimado_minutos: pessoasAFrente * mediaMinutos,
        media_atendimento_minutos: mediaMinutos,
        estimativa_atualizada_em: new Date().toISOString()
    };
}
