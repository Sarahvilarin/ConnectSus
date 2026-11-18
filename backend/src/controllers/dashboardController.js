import {
    obterIndicadoresAdministrativos
} from "../services/dashboardService.js";

import {
    obterIndicadoresEnfermeiro
} from "../services/dashboardEnfermeiroService.js";

export async function obterDashboardAdministrativo(req, res, next) {
    try {
        const indicadores = await obterIndicadoresAdministrativos();

        return res.status(200).json({
            mensagem: "Indicadores administrativos carregados.",
            dados: indicadores
        });
    } catch (error) {
        next(error);
    }
}

export async function obterDashboardEnfermeiro(req, res, next) {
    try {
        const enfermeiroId = req.enfermeiro.id;

        const indicadores = await obterIndicadoresEnfermeiro(enfermeiroId);

        return res.status(200).json({
            mensagem: "Indicadores do enfermeiro carregados.",
            dados: indicadores
        });
    } catch (error) {
        next(error);
    }
}