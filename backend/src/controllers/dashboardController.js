import {
    obterIndicadoresAdministrativos
} from "../services/dashboardService.js";

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