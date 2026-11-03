import {
    obterIndicadoresMedicos
} from "../services/dashboardService.js";

export async function obterDashboardMedico(req, res, next) {
    try {
        const medicoId = req.medico.id;

        const indicadores = await obterIndicadoresMedicos(medicoId);

        return res.status(200).json({
            mensagem: "Indicadores médicos carregados.",
            dados: indicadores
        });
    } catch (error) {
        next(error);
    }
}