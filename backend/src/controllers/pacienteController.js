
import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

function validarCPF(cpf) {
  if (!/^\d{11}$/.test(cpf)) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

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

  return (
    !Number.isNaN(dataObj.getTime()) &&
    dataObj.toISOString().slice(0, 10) === data &&
    data <= new Date().toISOString().slice(0, 10)
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
    } = req.body;

    const nome = String(nome_completo ?? "").trim();
    const cpfLimpo = normalizarCPF(cpf);
    const emailLimpo = String(email ?? "").trim().toLowerCase();

    if (nome.length < 3 || nome.length > 150) {
      return res.status(400).json({
        mensagem: "O nome deve ter entre 3 e 150 caracteres.",
      });
    }

    if (!validarCPF(cpfLimpo)) {
      return res.status(400).json({
        mensagem: "CPF inválido.",
      });
    }

    if (!validarDataNascimento(String(data_nascimento ?? ""))) {
      return res.status(400).json({
        mensagem: "Data de nascimento inválida.",
      });
    }

    if (
      emailLimpo.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
    ) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    if (
      typeof senha !== "string" ||
      senha.length < 12 ||
      senha.length > 72
    ) {
      return res.status(400).json({
        mensagem: "A senha deve ter entre 12 e 72 caracteres.",
      });
    }

    const telefoneLimpo = telefone
      ? String(telefone).trim()
      : null;

    if (telefoneLimpo && telefoneLimpo.length > 20) {
      return res.status(400).json({
        mensagem: "O telefone deve ter no máximo 20 caracteres.",
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
        mensagem: "Já existe um paciente cadastrado com esse CPF.",
      });
    }

    if (existentes.some((p) => p.email === emailLimpo)) {
      return res.status(409).json({
        mensagem: "Já existe um paciente cadastrado com esse e-mail.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado] = await pool.execute(
      `INSERT INTO pacientes
       (nome_completo, cpf, data_nascimento, email, telefone, senha_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nome,
        cpfLimpo,
        data_nascimento,
        emailLimpo,
        telefoneLimpo,
        senhaHash,
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
      },
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "Já existe um paciente com esse CPF ou e-mail.",
      });
    }

    return next(erro);
  }
}
