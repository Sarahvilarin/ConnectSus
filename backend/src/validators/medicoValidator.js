
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

    if (digito !== Number(cpf[tamanho])) {
      return false;
    }
  }

  return true;
}

function dataNascimentoValida(data) {
  if (typeof data !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split("-").map(Number);

  const nascimento = new Date(
    Date.UTC(ano, mes - 1, dia)
  );

  if (
    nascimento.getUTCFullYear() !== ano ||
    nascimento.getUTCMonth() !== mes - 1 ||
    nascimento.getUTCDate() !== dia
  ) {
    return false;
  }

  return nascimento <= new Date() && ano >= 1900;
}

export function validarMedico(dados, exigirSenha = true) {
  const erros = [];

  if (
    !dados ||
    typeof dados !== "object" ||
    Array.isArray(dados)
  ) {
    return ["Envie um objeto JSON válido."];
  }

  // Nome completo
  if (
    typeof dados.nome_completo !== "string" ||
    dados.nome_completo.trim().length < 3 ||
    dados.nome_completo.length > 150
  ) {
    erros.push("Nome completo inválido.");
  }

  // CPF
  if (!cpfValido(dados.cpf)) {
    erros.push("CPF inválido.");
  }

  // Data de nascimento
  if (!dataNascimentoValida(dados.data_nascimento)) {
    erros.push("Data de nascimento inválida.");
  }

  // E-mail
  if (
    typeof dados.email !== "string" ||
    dados.email.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)
  ) {
    erros.push("E-mail inválido.");
  }

  // Telefone opcional
  if (
    dados.telefone != null &&
    (
      typeof dados.telefone !== "string" ||
      !/^\d{10,11}$/.test(dados.telefone)
    )
  ) {
    erros.push("Telefone inválido. Use apenas números.");
  }

  // CRM
  if (
    typeof dados.crm !== "string" ||
    !/^\d{1,20}$/.test(dados.crm)
  ) {
    erros.push("CRM inválido.");
  }

  // UF do CRM
  const ufs = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF",
    "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
    "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  if (!ufs.includes(dados.uf_crm)) {
    erros.push("UF do CRM inválida.");
  }

  // Senha
  if (exigirSenha || dados.senha !== undefined) {
    if (
      typeof dados.senha !== "string" ||
      dados.senha.length < 12 ||
      dados.senha.length > 72
    ) {
      erros.push("A senha deve ter entre 12 e 72 caracteres.");
    }
  }

  // Especialidades
  if (
    !Array.isArray(dados.especialidades) ||
    dados.especialidades.length === 0 ||
    !dados.especialidades.every(
      id => Number.isSafeInteger(id) && id > 0
    ) ||
    new Set(dados.especialidades).size !==
    dados.especialidades.length
  ) {
    erros.push("Informe especialidades válidas, sem repetição.");
  }

  // Vínculos com unidades e setores
  if (
    !Array.isArray(dados.vinculos) ||
    dados.vinculos.length === 0
  ) {
    erros.push("Informe pelo menos um vínculo com unidade e setor.");
  } else {
    const combinacoes = new Set();

    for (const vinculo of dados.vinculos) {
      if (
        !vinculo ||
        typeof vinculo !== "object" ||
        !Number.isSafeInteger(vinculo.unidade_id) ||
        vinculo.unidade_id <= 0 ||
        !Number.isSafeInteger(vinculo.setor_id) ||
        vinculo.setor_id <= 0
      ) {
        erros.push("Existe um vínculo de unidade ou setor inválido.");
        continue;
      }

      const chave = `${vinculo.unidade_id}:${vinculo.setor_id}`;

      if (combinacoes.has(chave)) {
        erros.push("Existem vínculos repetidos.");
      }

      combinacoes.add(chave);
    }
  }

  return erros;
}
