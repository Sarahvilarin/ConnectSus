
import { pool } from "../config/database.js";
import {
    entrarNaFila,
    listarFilaPorUnidadeSetor,
    atualizarStatusFila,
    listarFilasDoPaciente,
    cancelarEntradaDoPaciente,
    calcularEstimativaEspera
} from "../services/filaService.js";

function idValido(id) {
    return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

function validarId(id, res) {
    if (!idValido(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return false;
    }
    return true;
}

function erroResposta(res, error) {
    if (error.status) {
        return res.status(error.status).json({ mensagem: error.message });
    }

    return res.status(500).json({
        mensagem: "Erro interno ao processar a fila."
    });
}

// Paciente entra na fila
export async function entrarPacienteNaFila(req, res, next) {
    try {
        const { unidade_id, setor_id, consulta_id = null, prioridade = "normal" } =
            req.body ?? {};

        if (
            !Number.isSafeInteger(unidade_id) ||
            unidade_id < 1 ||
            !Number.isSafeInteger(setor_id) ||
            setor_id < 1 ||
            (consulta_id !== null &&
                (!Number.isSafeInteger(consulta_id) || consulta_id < 1)) ||
            !["normal", "preferencial", "urgente"].includes(prioridade)
        ) {
            return res.status(400).json({
                mensagem: "Informe unidade, setor e dados válidos para entrar na fila."
            });
        }

        // A prioridade não é definida pelo próprio paciente.
        if (prioridade !== "normal") {
            return res.status(400).json({
                mensagem: "A prioridade deve ser definida pela equipe de atendimento."
            });
        }

        const entrada = await entrarNaFila({
            pacienteId: req.paciente.id,
            unidadeId: unidade_id,
            setorId: setor_id,
            consultaId: consulta_id,
            prioridade: "normal"
        });

        return res.status(201).json({
            mensagem: "Entrada na fila registrada com sucesso.",
            fila: entrada
        });
    } catch (error) {
        return erroResposta(res, error);
    }
}

// Paciente consulta apenas as próprias entradas

export async function listarMinhaFila(req, res, next) {
    try {
        const filas = await listarFilasDoPaciente(req.paciente.id);

        const filasComEstimativa = await Promise.all(
            filas.map(async (fila) => {
                const estimativa = await calcularEstimativaEspera(
                    fila.id,
                    req.paciente.id
                );

                return {
                    ...fila,
                    estimativa_espera: estimativa
                };
            })
        );

        return res.status(200).json(filasComEstimativa);
    } catch (error) {
        next(error);
    }
}


// Paciente cancela a própria entrada
export async function cancelarMinhaEntrada(req, res, next) {
    try {
        const { id } = req.params;
        if (!validarId(id, res)) return;

        const resultado = await cancelarEntradaDoPaciente(
            req.paciente.id,
            Number(id)
        );

        return res.status(200).json({
            mensagem: "Entrada na fila cancelada com sucesso.",
            fila: resultado
        });
    } catch (error) {
        return erroResposta(res, error);
    }
}

// Médico consulta a fila de sua unidade e setor vinculados
export async function listarFilaDoMedico(req, res, next) {
    try {
        const { unidade_id, setor_id } = req.query;

        if (!idValido(String(unidade_id ?? "")) ||
            !idValido(String(setor_id ?? ""))) {
            return res.status(400).json({
                mensagem: "Informe unidade_id e setor_id válidos."
            });
        }

        const [vinculos] = await pool.query(
            `SELECT 1
       FROM medico_unidade_setores
       WHERE medico_id = ?
         AND unidade_id = ?
         AND setor_id = ?
       LIMIT 1`,
            [req.medico.id, Number(unidade_id), Number(setor_id)]
        );

        if (vinculos.length === 0) {
            return res.status(403).json({
                mensagem: "Você não possui vínculo com essa unidade e setor."
            });
        }

        const filas = await listarFilaPorUnidadeSetor(
            Number(unidade_id),
            Number(setor_id)
        );

        return res.status(200).json({
            total: filas.length,
            filas
        });
    } catch (error) {
        next(error);
    }
}

// Médico atualiza o status da entrada na fila
export async function atualizarStatusDaFila(req, res, next) {
    try {
        const { id } = req.params;
        const { status, unidade_id, setor_id } = req.body ?? {};

        if (!validarId(id, res)) return;

        if (
            !Number.isSafeInteger(unidade_id) ||
            unidade_id < 1 ||
            !Number.isSafeInteger(setor_id) ||
            setor_id < 1 ||
            !["chamado", "em_atendimento", "concluido", "desistente", "cancelado"].includes(status)
        ) {
            return res.status(400).json({
                mensagem: "Informe status, unidade e setor válidos."
            });
        }

        const [vinculos] = await pool.query(
            `SELECT 1
       FROM medico_unidade_setores
       WHERE medico_id = ?
         AND unidade_id = ?
         AND setor_id = ?
       LIMIT 1`,
            [req.medico.id, unidade_id, setor_id]
        );

        if (vinculos.length === 0) {
            return res.status(403).json({
                mensagem: "Você não possui vínculo com essa unidade e setor."
            });
        }

        const resultado = await atualizarStatusFila({
            filaId: Number(id),
            unidadeId: unidade_id,
            setorId: setor_id,
            novoStatus: status
        });

        return res.status(200).json({
            mensagem: "Status da fila atualizado com sucesso.",
            fila: resultado
        });
    } catch (error) {
        return erroResposta(res, error);
    }
}

// Administrador consulta filas de qualquer unidade e setor
export async function listarFilasAdmin(req, res, next) {
    try {
        const { unidade_id, setor_id } = req.query;

        if (!idValido(String(unidade_id ?? "")) ||
            !idValido(String(setor_id ?? ""))) {
            return res.status(400).json({
                mensagem: "Informe unidade_id e setor_id válidos."
            });
        }

        const filas = await listarFilaPorUnidadeSetor(
            Number(unidade_id),
            Number(setor_id)
        );

        return res.status(200).json({
            total: filas.length,
            filas
        });
    } catch (error) {
        next(error);
    }
}
