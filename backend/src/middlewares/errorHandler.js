
export function errorHandler(error, req, res, next) {
  console.error("Erro na API:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    mensagem: "Erro interno no servidor."
  });
}
