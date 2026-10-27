
import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

function validarCPF(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(cpf[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;

  return digito === Number(cpf[10]);
}

function normalizarCPF(cpf) {
  return String(cpf ?? "").replace(/\D/g, "");
}

function validarDataNascimento(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

  const dataObj = new Date(`${data}T00:00:00Z`);
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    !Number.isNaN(dataObj.getTime()) &&
    dataObj.toISOString().slice(0, 10) === data &&
    data <= hoje
  );
}

// POST /api/pacientes
export async function cadastrarPaciente(req, res, next) {
  try {
    const {
      nome_completo,
      cpf,
      data_nascimento,
      email,
      telefone,
      senha,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      complemento,
      sexo,
      cns,
      nome_mae,
      nome_social
    } = req.body ?? {};

    const nome = String(nome_completo ?? "").trim();
    const cpfLimpo = normalizarCPF(cpf);
    const emailLimpo = String(email ?? "").trim().toLowerCase();

    const cepLimpo = String(cep ?? "").replace(/\D/g, "");
    const ruaLimpa = String(rua ?? "").trim();
    const numeroLimpo = String(numero ?? "").trim();
    const bairroLimpo = String(bairro ?? "").trim();
    const cidadeLimpa = String(cidade ?? "").trim();
    const complementoLimpo = String(complemento ?? "").trim();
    const sexoLimpo = String(sexo ?? "").trim().toLowerCase();
    const cnsLimpo = String(cns ?? "").replace(/\D/g, "");
    const nomeMaeLimpo = String(nome_mae ?? "").trim();
    const nomeSocialLimpo = String(nome_social ?? "").trim();
    const telefoneLimpo = telefone ? String(telefone).trim() : null;

    if (nome.length < 3 || nome.length > 150) {
      return res.status(400).json({
        mensagem: "O nome deve ter entre 3 e 150 caracteres."
      });
    }

    if (!validarCPF(cpfLimpo)) {
      return res.status(400).json({ mensagem: "CPF inválido." });
    }

    if (!validarDataNascimento(String(data_nascimento ?? ""))) {
      return res.status(400).json({
        mensagem: "Data de nascimento inválida."
      });
    }

    if (
      emailLimpo.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
    ) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido."
      });
    }

    if (typeof senha !== "string" || senha.length < 12 || senha.length > 72) {
      return res.status(400).json({
        mensagem: "A senha deve ter entre 12 e 72 caracteres."
      });
    }

    if (!/^\d{8}$/.test(cepLimpo)) {
      return res.status(400).json({
        mensagem: "Informe um CEP válido com 8 dígitos."
      });
    }

    if (!ruaLimpa || ruaLimpa.length > 150) {
      return res.status(400).json({
        mensagem: "Informe a rua, com no máximo 150 caracteres."
      });
    }

    if (!numeroLimpo || numeroLimpo.length > 20) {
      return res.status(400).json({
        mensagem: "Informe o número do endereço."
      });
    }

    if (!bairroLimpo || bairroLimpo.length > 100) {
      return res.status(400).json({
        mensagem: "Informe um bairro válido."
      });
    }

    if (!cidadeLimpa || cidadeLimpa.length > 100) {
      return res.status(400).json({
        mensagem: "Informe uma cidade válida."
      });
    }

    const sexosPermitidos = [
      "feminino",
      "masculino",
      "intersexo",
      "não informado"
    ];

    if (!sexosPermitidos.includes(sexoLimpo)) {
      return res.status(400).json({
        mensagem: "Selecione uma opção válida para o sexo."
      });
    }

    if (complementoLimpo.length > 100) {
      return res.status(400).json({
        mensagem: "O complemento deve ter no máximo 100 caracteres."
      });
    }

    if (cnsLimpo && !/^\d{15}$/.test(cnsLimpo)) {
      return res.status(400).json({
        mensagem: "O CNS deve conter 15 dígitos."
      });
    }

    if (nomeMaeLimpo.length > 150 || nomeSocialLimpo.length > 150) {
      return res.status(400).json({
        mensagem: "Nome da mãe e nome social devem ter no máximo 150 caracteres."
      });
    }

    if (telefoneLimpo && telefoneLimpo.length > 20) {
      return res.status(400).json({
        mensagem: "O telefone deve ter no máximo 20 caracteres."
      });
    }

    const [existentes] = await pool.execute(
      `SELECT cpf, email
       FROM pacientes
       WHERE cpf = ? OR email = ?`,
      [cpfLimpo, emailLimpo]
    );

    if (existentes.some((p) => p.cpf === cpfLimpo)) {
      return res.status(409).json({
        mensagem: "Já existe um paciente cadastrado com esse CPF."
      });
    }

    if (existentes.some((p) => p.email === emailLimpo)) {
      return res.status(409).json({
        mensagem: "Já existe um paciente cadastrado com esse e-mail."
      });
    }

    if (cnsLimpo) {
      const [pacientesCNS] = await pool.execute(
        "SELECT id FROM pacientes WHERE cns = ? LIMIT 1",
        [cnsLimpo]
      );

      if (pacientesCNS.length > 0) {
        return res.status(409).json({
          mensagem: "Já existe um paciente cadastrado com esse CNS."
        });
      }
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado] = await pool.execute(
      `INSERT INTO pacientes (
        nome_completo, cpf, data_nascimento, email, telefone,
        senha_hash, cep, rua, numero, bairro, cidade, complemento,
        sexo, cns, nome_mae, nome_social
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        cpfLimpo,
        data_nascimento,
        emailLimpo,
        telefoneLimpo,
        senhaHash,
        cepLimpo,
        ruaLimpa,
        numeroLimpo,
        bairroLimpo,
        cidadeLimpa,
        complementoLimpo || null,
        sexoLimpo,
        cnsLimpo || null,
        nomeMaeLimpo || null,
        nomeSocialLimpo || null
      ]
    );

    return res.status(201).json({
      mensagem: "Paciente cadastrado com sucesso.",
      paciente: {
        id: resultado.insertId,
        nome_completo: nome,
        cpf: cpfLimpo,
        data_nascimento,
        email: emailLimpo,
        telefone: telefoneLimpo,
        cep: cepLimpo,
        rua: ruaLimpa,
        numero: numeroLimpo,
        bairro: bairroLimpo,
        cidade: cidadeLimpa,
        complemento: complementoLimpo || null,
        sexo: sexoLimpo,
        cns: cnsLimpo || null,
        nome_mae: nomeMaeLimpo || null,
        nome_social: nomeSocialLimpo || null
      }
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Já existe um paciente com esse CPF, e-mail ou CNS."
      });
    }

    return next(erro);
  }
}


export async function obterMeuPerfil(req, res, next) {
  try {
    const [pacientes] = await pool.query(
      `SELECT
        id,
        nome_completo,
        nome_social,
        cpf,
        data_nascimento,
        email,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        complemento,
        sexo,
        cns,
        nome_mae,
        criado_em
       FROM pacientes
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [req.paciente.id]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        mensagem: "Perfil do paciente não encontrado."
      });
    }

    return res.status(200).json({
      paciente: pacientes[0]
    });
  } catch (error) {
    return next(error);
  }
}


export async function atualizarMeuPerfil(req, res, next) {
  try {
    const {
      nome_completo,
      data_nascimento,
      email,
      telefone,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      complemento,
      sexo,
      cns,
      nome_mae,
      nome_social
    } = req.body ?? {};

    const campos = {};
    const corpo = req.body ?? {};

    if (
      Object.hasOwn(corpo, "nome_completo")
    ) {
      const nome = String(nome_completo ?? "").trim();

      if (nome.length < 3 || nome.length > 150) {
        return res.status(400).json({
          mensagem: "O nome deve ter entre 3 e 150 caracteres."
        });
      }

      campos.nome_completo = nome;
    }

    if (Object.hasOwn(corpo, "data_nascimento")) {
      if (!validarDataNascimento(String(data_nascimento ?? ""))) {
        return res.status(400).json({
          mensagem: "Data de nascimento inválida."
        });
      }

      campos.data_nascimento = data_nascimento;
    }

    if (Object.hasOwn(corpo, "email")) {
      const emailLimpo = String(email ?? "").trim().toLowerCase();

      if (
        emailLimpo.length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
      ) {
        return res.status(400).json({
          mensagem: "Informe um e-mail válido."
        });
      }

      const [existentes] = await pool.execute(
        "SELECT id FROM pacientes WHERE email = ? AND id <> ? LIMIT 1",
        [emailLimpo, req.paciente.id]
      );

      if (existentes.length > 0) {
        return res.status(409).json({
          mensagem: "Este e-mail já está cadastrado."
        });
      }

      campos.email = emailLimpo;
    }

    if (Object.hasOwn(corpo, "telefone")) {
      const valor = String(telefone ?? "").trim();

      if (valor.length > 20) {
        return res.status(400).json({
          mensagem: "O telefone deve ter no máximo 20 caracteres."
        });
      }

      campos.telefone = valor || null;
    }

    if (Object.hasOwn(corpo, "cep")) {
      const valor = String(cep ?? "").replace(/\D/g, "");

      if (!/^\d{8}$/.test(valor)) {
        return res.status(400).json({
          mensagem: "Informe um CEP válido com 8 dígitos."
        });
      }

      campos.cep = valor;
    }

    const camposObrigatorios = [
      ["rua", rua, 150],
      ["numero", numero, 20],
      ["bairro", bairro, 100],
      ["cidade", cidade, 100]
    ];

    for (const [campo, valor, limite] of camposObrigatorios) {
      if (Object.hasOwn(corpo, campo)) {
        const texto = String(valor ?? "").trim();

        if (!texto || texto.length > limite) {
          return res.status(400).json({
            mensagem: `Informe um valor válido para ${campo}.`
          });
        }

        campos[campo] = texto;
      }
    }

    if (Object.hasOwn(corpo, "complemento")) {
      const valor = String(complemento ?? "").trim();

      if (valor.length > 100) {
        return res.status(400).json({
          mensagem: "O complemento deve ter no máximo 100 caracteres."
        });
      }

      campos.complemento = valor || null;
    }

    if (Object.hasOwn(corpo, "sexo")) {
      const valor = String(sexo ?? "").trim().toLowerCase();
      const permitidos = [
        "feminino",
        "masculino",
        "intersexo",
        "não informado"
      ];

      if (!permitidos.includes(valor)) {
        return res.status(400).json({
          mensagem: "Selecione uma opção válida para o sexo."
        });
      }

      campos.sexo = valor;
    }

    if (Object.hasOwn(corpo, "cns")) {
      const valor = String(cns ?? "").replace(/\D/g, "");

      if (valor && !/^\d{15}$/.test(valor)) {
        return res.status(400).json({
          mensagem: "O CNS deve conter 15 dígitos."
        });
      }

      if (valor) {
        const [existentes] = await pool.execute(
          "SELECT id FROM pacientes WHERE cns = ? AND id <> ? LIMIT 1",
          [valor, req.paciente.id]
        );

        if (existentes.length > 0) {
          return res.status(409).json({
            mensagem: "Este CNS já está cadastrado."
          });
        }
      }

      campos.cns = valor || null;
    }

    for (const [campo, valor] of [
      ["nome_mae", nome_mae],
      ["nome_social", nome_social]
    ]) {
      if (Object.hasOwn(corpo, campo)) {
        const texto = String(valor ?? "").trim();

        if (texto.length > 150) {
          return res.status(400).json({
            mensagem: `${campo} deve ter no máximo 150 caracteres.`
          });
        }

        campos[campo] = texto || null;
      }
    }

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        mensagem: "Informe ao menos um campo válido para atualizar."
      });
    }

    const nomesColunas = Object.keys(campos);
    const atribuicoes = nomesColunas
      .map((campo) => `\`${campo}\` = ?`)
      .join(", ");
    const valores = nomesColunas.map((campo) => campos[campo]);

    await pool.execute(
      `UPDATE pacientes
       SET ${atribuicoes}
       WHERE id = ? AND ativo = TRUE`,
      [...valores, req.paciente.id]
    );

    const [atualizados] = await pool.execute(
      `SELECT
        id, nome_completo, nome_social, cpf, data_nascimento,
        email, telefone, cep, rua, numero, bairro, cidade,
        complemento, sexo, cns, nome_mae, criado_em
       FROM pacientes
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [req.paciente.id]
    );

    if (atualizados.length === 0) {
      return res.status(404).json({
        mensagem: "Perfil do paciente não encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Perfil atualizado com sucesso.",
      paciente: atualizados[0]
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Um dos dados informados já está cadastrado."
      });
    }

    return next(error);
  }
}


export async function alterarSenhaPaciente(req, res, next) {
  try {
    const { senha_atual, nova_senha } = req.body ?? {};

    if (
      typeof senha_atual !== "string" ||
      typeof nova_senha !== "string" ||
      !senha_atual ||
      !nova_senha
    ) {
      return res.status(400).json({
        mensagem: "Informe a senha atual e a nova senha."
      });
    }

    if (nova_senha.length < 12 || nova_senha.length > 72) {
      return res.status(400).json({
        mensagem: "A nova senha deve ter entre 12 e 72 caracteres."
      });
    }

    if (senha_atual === nova_senha) {
      return res.status(400).json({
        mensagem: "A nova senha deve ser diferente da senha atual."
      });
    }

    const [pacientes] = await pool.execute(
      `SELECT id, senha_hash
       FROM pacientes
       WHERE id = ? AND ativo = TRUE
       LIMIT 1`,
      [req.paciente.id]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        mensagem: "Paciente não encontrado."
      });
    }

    const senhaAtualValida = await bcrypt.compare(
      senha_atual,
      pacientes[0].senha_hash
    );

    if (!senhaAtualValida) {
      return res.status(401).json({
        mensagem: "A senha atual está incorreta."
      });
    }

    const novoHash = await bcrypt.hash(nova_senha, 12);

    await pool.execute(
      `UPDATE pacientes
       SET senha_hash = ?
       WHERE id = ? AND ativo = TRUE`,
      [novoHash, req.paciente.id]
    );

    return res.status(200).json({
      mensagem: "Senha alterada com sucesso."
    });
  } catch (error) {
    return next(error);
  }
}
