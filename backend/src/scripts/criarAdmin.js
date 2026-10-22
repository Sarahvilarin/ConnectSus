
import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

async function criarAdministrador() {
  try {
    const nome = process.env.ADMIN_NOME;
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_SENHA;

    if (!nome || !email || !senha) {
      throw new Error(
        "Configure ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA."
      );
    }

    if (senha.length < 12) {
      throw new Error(
        "A senha deve ter pelo menos 12 caracteres."
      );
    }

    const [existentes] = await pool.query(
      "SELECT id FROM administradores WHERE email = ?",
      [email]
    );

    if (existentes.length > 0) {
      console.log("Administrador já cadastrado.");
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await pool.query(
      `INSERT INTO administradores
       (nome, email, senha_hash)
       VALUES (?, ?, ?)`,
      [nome, email, senhaHash]
    );

    console.log("Administrador criado com sucesso!");
  } catch (error) {
    console.error("Erro:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

criarAdministrador();
