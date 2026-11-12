
import { pool } from "../config/database.js";

// Indicadores gerais do dashboard administrativo.
export async function obterIndicadoresAdministrativos() {
    const [
        [pacientes],
        [medicos],
        [totalUnidades],
        [consultasHoje],
        [consultasPorStatus],
        [atendimentosDomiciliares],
        [pacientesNaFila],
        [unidadesResumo]
    ] = await Promise.all([

        // Total de pacientes ativos.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM pacientes
            WHERE ativo = TRUE
        `),

        // Total de médicos ativos.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM medicos
            WHERE ativo = TRUE
        `),

        // Total de unidades ativas.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM unidades
            WHERE ativo = TRUE
        `),

        // Consultas agendadas para hoje.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM consultas
            WHERE DATE(data_hora) = CURDATE()
              AND status IN ('pendente', 'confirmada')
        `),

        // Distribuição das consultas por status.
        pool.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM consultas
            GROUP BY status
        `),

        // Distribuição dos atendimentos domiciliares por status.
        pool.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM atendimentos_domiciliares
            GROUP BY status
        `),

        // Pacientes que estão aguardando na fila.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM filas
            WHERE status = 'aguardando'
        `),

        // Resumo de cada unidade, com consultas e pacientes aguardando.
        pool.query(`
            SELECT
                u.id,
                u.nome,
                u.bairro,
                COUNT(DISTINCT c.id) AS total_consultas,
                COUNT(
                    DISTINCT CASE
                        WHEN f.status = 'aguardando' THEN f.id
                    END
                ) AS pacientes_aguardando
            FROM unidades u
            LEFT JOIN consultas c
                ON c.unidade_id = u.id
            LEFT JOIN filas f
                ON f.unidade_id = u.id
            WHERE u.ativo = TRUE
            GROUP BY u.id, u.nome, u.bairro
            ORDER BY u.nome ASC
        `)
    ]);

    return {
        pacientes_ativos: pacientes[0].total,
        medicos_ativos: medicos[0].total,
        unidades_ativas: totalUnidades[0].total,
        consultas_hoje: consultasHoje[0].total,
        consultas_por_status: consultasPorStatus,
        atendimentos_domiciliares_por_status: atendimentosDomiciliares,
        pacientes_aguardando: pacientesNaFila[0].total,
        unidades: unidadesResumo
    };
}

// Indicadores do dashboard médico.
export async function obterIndicadoresMedicos(medicoId) {
    const [
        [consultasHoje],
        [proximasConsultas],
        [pacientesAtendidos],
        [pacientesNaFila],
        [atendimentosDomiciliares]
    ] = await Promise.all([

        // Consultas do médico para hoje.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM consultas
            WHERE medico_id = ?
              AND DATE(data_hora) = CURDATE()
              AND status IN ('pendente', 'confirmada')
        `, [medicoId]),

        // Próximas consultas agendadas.
        pool.query(`
            SELECT
                c.id,
                c.data_hora,
                c.status,
                p.nome_completo AS paciente,
                u.nome AS unidade
            FROM consultas c
            INNER JOIN pacientes p ON p.id = c.paciente_id
            INNER JOIN unidades u ON u.id = c.unidade_id
            WHERE c.medico_id = ?
              AND c.data_hora >= NOW()
              AND c.status IN ('pendente', 'confirmada')
            ORDER BY c.data_hora ASC
            LIMIT 10
        `, [medicoId]),

        // Pacientes atendidos hoje.
        pool.query(`
            SELECT COUNT(DISTINCT paciente_id) AS total
            FROM consultas
            WHERE medico_id = ?
              AND DATE(data_hora) = CURDATE()
              AND status = 'concluida'
        `, [medicoId]),

        // Pacientes aguardando na fila.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM filas f
            INNER JOIN consultas c ON c.id = f.consulta_id
            WHERE c.medico_id = ?
              AND f.status = 'aguardando'
        `, [medicoId]),

        // Atendimentos domiciliares atribuídos ao médico.
        pool.query(`
            SELECT
                id,
                paciente_id,
                unidade_id,
                motivo,
                data_agendada,
                status
            FROM atendimentos_domiciliares
            WHERE medico_id = ?
              AND status IN ('agendado', 'em_andamento')
            ORDER BY data_agendada ASC
        `, [medicoId])
    ]);

    return {
        consultas_hoje: consultasHoje[0].total,
        proximas_consultas: proximasConsultas,
        pacientes_atendidos_hoje: pacientesAtendidos[0].total,
        pacientes_aguardando: pacientesNaFila[0].total,
        atendimentos_domiciliares: atendimentosDomiciliares
    };
}
