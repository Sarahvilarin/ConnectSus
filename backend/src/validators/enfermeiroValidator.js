
function cpfValido(cpf) {
  if (typeof cpf !== "string") return false;
  if (!/^\d{11}$/.test(cpf)) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;
    const digito = resto === 10 ? 0 : resto;

    if (digito !== Number(cpf[tamanho])) return false;
  }

  return true;
}

function dataNascimentoValida(data) {
  if (typeof data !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

  const [ano, mes, dia] = data.split("-").map(Number);
  const nascimento = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    nascimento.getUTCFullYear() === ano &&
    nascimento.getUTCMonth() === mes - 1 &&
    nascimento.getUTCDate() === dia &&
    nascimento <= new Date() &&
    ano >= 1900
  );
}

export function validarEnfermeiro(dados, exigirSenha = true) {
  const erros = [];

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return ["Envie um objeto JSON válido."];
  }

  if (
    typeof dados.nome_completo !== "string" ||
    dados.nome_completo.trim().length < 3 ||
    dados.nome_completo.length > 150
  ) {
    erros.push("Nome completo inválido.");
  }

  if (!cpfValido(dados.cpf)) {
    erros.push("CPF inválido.");
  }

  if (!dataNascimentoValida(dados.data_nascimento)) {
    erros.push("Data de nascimento inválida.");
  }

  if (
    typeof dados.email !== "string" ||
    dados.email.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)
  ) {
    erros.push("E-mail inválido.");
  }

  if (
    dados.telefone != null &&
    (
      typeof dados.telefone !== "string" ||
      !/^\d{10,11}$/.test(dados.telefone)
    )
  ) {
    erros.push("Telefone inválido. Use apenas números.");
  }

  if (
    typeof dados.coren !== "string" ||
    !/^\d{1,20}$/.test(dados.coren)
  ) {
    erros.push("COREN inválido.");
  }

  const ufs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF",
    "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
    "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  if (!ufs.includes(dados.uf_coren)) {
    erros.push("UF do COREN inválida.");
  }

  if (exigirSenha || dados.senha !== undefined) {
    if (
      typeof dados.senha !== "string" ||
      dados.senha.length < 12 ||
      dados.senha.length > 72
    ) {
      erros.push("A senha deve ter entre 12 e 72 caracteres.");
    }
  }

  return erros;
}
