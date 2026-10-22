
export function validarUnidade(dados) {
  const erros = [];

  if (!dados || typeof dados !== "object" ||
      Array.isArray(dados)) {
    return ["Envie um objeto JSON válido."];
  }

  const obrigatorios = [
    "nome",
    "cnes",
    "tipo_unidade_id",
    "rua",
    "bairro",
    "cep"
  ];

  for (const campo of obrigatorios) {
    const valor = dados[campo];

    if (
      valor === undefined ||
      valor === null ||
      (typeof valor === "string" && !valor.trim())
    ) {
      erros.push(`O campo ${campo} é obrigatório.`);
    }
  }

  if (
    dados.nome !== undefined &&
    (typeof dados.nome !== "string" ||
      dados.nome.trim().length > 150)
  ) {
    erros.push("Nome inválido (máximo 150 caracteres).");
  }

  if (
    dados.cnes !== undefined &&
    (typeof dados.cnes !== "string" ||
      !/^\d{7}$/.test(dados.cnes))
  ) {
    erros.push("O CNES deve conter exatamente 7 números.");
  }

  if (
    dados.cep !== undefined &&
    (typeof dados.cep !== "string" ||
      !/^\d{5}-?\d{3}$/.test(dados.cep))
  ) {
    erros.push("CEP inválido. Use 00000-000.");
  }

  if (
    dados.tipo_unidade_id !== undefined &&
    (!Number.isInteger(dados.tipo_unidade_id) ||
      dados.tipo_unidade_id <= 0)
  ) {
    erros.push("Tipo de unidade inválido.");
  }

  for (const campo of ["rua", "bairro"]) {
    if (
      dados[campo] !== undefined &&
      (typeof dados[campo] !== "string" ||
        !dados[campo].trim() ||
        dados[campo].length > (campo === "rua" ? 150 : 100))
    ) {
      erros.push(`O campo ${campo} é inválido.`);
    }
  }

  const opcionais = {
    telefone: 20,
    horario_funcionamento: 255,
    servicos_disponiveis: 65535
  };

  for (const [campo, limite] of Object.entries(opcionais)) {
    const valor = dados[campo];

    if (
      valor !== undefined &&
      valor !== null &&
      (typeof valor !== "string" || valor.length > limite)
    ) {
      erros.push(`O campo ${campo} é inválido.`);
    }
  }

  return erros;
}
