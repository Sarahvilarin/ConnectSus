import { pool } from "../config/database.js";

// Indicadores gerais do dashboard administrativo.
export async function obterIndicadoresAdministrativos() {
    const [
        [pacientes],
        [medicos],
        [unidades],
        [consultasHoje],
        [consultasPorStatus],
        [atendimentosDomiciliares],
        [pacientesNaFila]
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
        `)
    ]);

    return {
        pacientes_ativos: pacientes[0].total,
        medicos_ativos: medicos[0].total,
        unidades_ativas: unidades[0].total,
        consultas_hoje: consultasHoje[0].total,
        consultas_por_status: consultasPorStatus,
        atendimentos_domiciliares_por_status: atendimentosDomiciliares,
        pacientes_aguardando: pacientesNaFila[0].total
    };
}