import {
  solicitarAtendimentoDomiciliar,
  listarAtendimentosDoPaciente,
  buscarAtendimentoDomiciliar,
  listarTodosAtendimentosDomiciliares,
  listarEnfermeirosAtivos,
  listarAtendimentosDoEnfermeiro,
  agendarAtendimentoDomiciliarAdmin,
  atualizarStatusAtendimentoDomiciliarAdmin,
  atualizarStatusAtendimentoDomiciliarEnfermeiro,
  cancelarAtendimentoDoPaciente,
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
      complemento: req.body.complemento,
    });

    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function listarDoPaciente(req, res, next) {
  try {
    const atendimentos = await listarAtendimentosDoPaciente(req.paciente.id);
    return res.status(200).json(atendimentos);
  } catch (error) {
    return next(error);
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
      ...resultado,
    });
  } catch (error) {
    return next(error);
  }
}

// Rotas administrativas: todas as unidades.
export async function listarTodasAdmin(req, res, next) {
  try {
    const atendimentos = await listarTodosAtendimentosDomiciliares();
    return res.status(200).json({ atendimentos });
  } catch (error) {
    return next(error);
  }
}

export async function buscarPorIdAdmin(req, res, next) {
  try {
    const atendimento = await buscarAtendimentoDomiciliar(req.params.id);
    return res.status(200).json({ atendimento });
  } catch (error) {
    return next(error);
  }
}

export async function listarEnfermeirosAdmin(req, res, next) {
  try {
    const enfermeiros = await listarEnfermeirosAtivos();
    return res.status(200).json({ enfermeiros });
  } catch (error) {
    return next(error);
  }
}

export async function listarDoEnfermeiro(req, res, next) {
  try {
    const enfermeiroId = req.enfermeiro?.id;
    if (!enfermeiroId) {
      return res.status(401).json({ mensagem: "Não foi possível identificar o enfermeiro autenticado." });
    }

    const atendimentos = await listarAtendimentosDoEnfermeiro(enfermeiroId);
    return res.status(200).json({ atendimentos });
  } catch (error) {
    return next(error);
  }
}

export async function agendarAdmin(req, res, next) {
  try {
    const resultado = await agendarAtendimentoDomiciliarAdmin({
      id: req.params.id,
      enfermeiroId: req.body.enfermeiro_id,
      dataAgendada: req.body.data_agendada,
    });

    return res.status(200).json({
      mensagem: "Atendimento domiciliar agendado.",
      ...resultado,
    });
  } catch (error) {
    return next(error);
  }
}

export async function atualizarStatusAdmin(req, res, next) {
  try {
    const resultado = await atualizarStatusAtendimentoDomiciliarAdmin({
      id: req.params.id,
      novoStatus: req.body.status,
      observacoes: req.body.observacoes ?? null,
    });

    return res.status(200).json({
      mensagem: "Status do atendimento atualizado.",
      ...resultado,
    });
  } catch (error) {
    return next(error);
  }
}

export async function atualizarStatusEnfermeiro(req, res, next) {
  try {
    const enfermeiroId = req.enfermeiro?.id;
    if (!enfermeiroId) {
      return res.status(401).json({ mensagem: "Não foi possível identificar o enfermeiro autenticado." });
    }

    const resultado = await atualizarStatusAtendimentoDomiciliarEnfermeiro({
      id: req.params.id,
      enfermeiroId,
      novoStatus: req.body.status,
      observacoes: req.body.observacoes ?? null,
    });

    return res.status(200).json({
      mensagem: "Andamento da visita atualizado.",
      ...resultado,
    });
  } catch (error) {
    return next(error);
  }
}
