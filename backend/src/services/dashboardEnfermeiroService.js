import { pool } from "../config/database.js";

// Indicadores do dashboard do enfermeiro.
export async function obterIndicadoresEnfermeiro(enfermeiroId) {
    const [
        [triagens],
        [pacientesAcompanhados],
        [visitasConcluidas],
        [atividadesSemana],
        [distribuicaoAtividades]
    ] = await Promise.all([

        // Total de triagens realizadas pelo enfermeiro.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM triagens
            WHERE enfermeiro_id = ?
        `, [enfermeiroId]),

        // Total de pacientes únicos atendidos em triagens.
        pool.query(`
            SELECT COUNT(DISTINCT paciente_id) AS total
            FROM triagens
            WHERE enfermeiro_id = ?
        `, [enfermeiroId]),

        // Total de visitas domiciliares concluídas.
        pool.query(`
            SELECT COUNT(*) AS total
            FROM atendimentos_domiciliares
            WHERE enfermeiro_id = ?
              AND status = 'concluido'
        `, [enfermeiroId]),

        // Atividades realizadas nos últimos 7 dias.
        pool.query(`
            SELECT
                DATE(atividade_data) AS data,
                SUM(triagens) AS triagens,
                SUM(visitas) AS visitas,
                SUM(triagens + visitas) AS total
            FROM (
                SELECT
                    DATE(criado_em) AS atividade_data,
                    COUNT(*) AS triagens,
                    0 AS visitas
                FROM triagens
                WHERE enfermeiro_id = ?
                  AND criado_em >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(criado_em)

                UNION ALL

                SELECT
                    DATE(data_conclusao) AS atividade_data,
                    0 AS triagens,
                    COUNT(*) AS visitas
                FROM atendimentos_domiciliares
                WHERE enfermeiro_id = ?
                  AND status = 'concluido'
                  AND data_conclusao >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(data_conclusao)
            ) AS atividades
            GROUP BY DATE(atividade_data)
            ORDER BY data ASC
        `, [enfermeiroId, enfermeiroId]),

        // Distribuição geral entre triagens e visitas concluídas.
        pool.query(`
            SELECT
                'triagens' AS tipo,
                COUNT(*) AS total
            FROM triagens
            WHERE enfermeiro_id = ?

            UNION ALL

            SELECT
                'visitas_domiciliares' AS tipo,
                COUNT(*) AS total
            FROM atendimentos_domiciliares
            WHERE enfermeiro_id = ?
              AND status = 'concluido'
        `, [enfermeiroId, enfermeiroId])
    ]);

    const totalTriagens = Number(triagens[0].total);
    const totalVisitas = Number(visitasConcluidas[0].total);

    return {
        atendimentos_realizados: totalTriagens + totalVisitas,
        pacientes_acompanhados: Number(pacientesAcompanhados[0].total),
        triagens_realizadas: totalTriagens,
        visitas_domiciliares: totalVisitas,

        atividades_semana: atividadesSemana.map((atividade) => ({
            data: atividade.data,
            triagens: Number(atividade.triagens),
            visitas: Number(atividade.visitas),
            total: Number(atividade.total)
        })),

        distribuicao_atividades: distribuicaoAtividades.map((atividade) => ({
            tipo: atividade.tipo,
            total: Number(atividade.total)
        }))
    };
}