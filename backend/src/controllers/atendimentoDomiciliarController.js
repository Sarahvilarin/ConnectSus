import {
    solicitarAtendimentoDomiciliar,
    listarAtendimentosDoPaciente,
    buscarAtendimentoDomiciliar,
    listarAtendimentosDaUnidade,
    agendarAtendimentoDomiciliar,
    atualizarStatusAtendimentoDomiciliar,
    cancelarAtendimentoDoPaciente
} from "../services/atendimentoDomiciliarService.js";

export async function solicitar(req, res, next) {
    try {
        const resultado = await solicitarAtendimentoDomiciliar({
            pacienteId: req.paciente.id,
            unidadeId: req.body.unidade_id,
            motivo: req.body.motivo,
            rua: req.body.rua,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cep: req.body.cep,
            complemento: req.body.complemento
        });

        return res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
}

export async function listarDoPaciente(req, res, next) {
    try {
        const atendimentos = await listarAtendimentosDoPaciente(
            req.paciente.id
        );

        return res.status(200).json(atendimentos);
    } catch (error) {
        next(error);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const atendimento = await buscarAtendimentoDomiciliar(
            req.params.id
        );

        return res.status(200).json(atendimento);
    } catch (error) {
        next(error);
    }
}

export async function listarDaUnidade(req, res, next) {
    try {
        const atendimentos = await listarAtendimentosDaUnidade(
            req.query.unidade_id
        );

        return res.status(200).json(atendimentos);
    } catch (error) {
        next(error);
    }
}

export async function agendar(req, res, next) {
    try {
        const resultado = await agendarAtendimentoDomiciliar({
            id: req.params.id,
            unidadeId: req.body.unidade_id,
            medicoId: req.body.medico_id,
            dataAgendada: req.body.data_agendada
        });

        return res.status(200).json({
            mensagem: "Atendimento domiciliar agendado.",
            ...resultado
        });
    } catch (error) {
        next(error);
    }
}

export async function atualizarStatus(req, res, next) {
    try {
        const resultado = await atualizarStatusAtendimentoDomiciliar({
            id: req.params.id,
            unidadeId: req.body.unidade_id,
            novoStatus: req.body.status,
            observacoes: req.body.observacoes
        });

        return res.status(200).json({
            mensagem: "Status do atendimento atualizado.",
            ...resultado
        });
    } catch (error) {
        next(error);
    }
}

export async function cancelar(req, res, next) {
    try {
        const resultado = await cancelarAtendimentoDoPaciente(
            req.paciente.id,
            req.params.id
        );

        return res.status(200).json({
            mensagem: "Solicitação cancelada.",
            ...resultado
        });
    } catch (error) {
        next(error);
    }
}