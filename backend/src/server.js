
import "dotenv/config";
import app from "./app.js";

import {
  checkDatabaseConnection,
  pool
} from "./config/database.js";

const PORT = process.env.PORT || 8080;

async function iniciarServidor() {
  try {
    const conectado = await checkDatabaseConnection();

    if (!conectado) {
      console.warn("Aviso: Falha na conexão inicial com o banco de dados. Verifique se o MySQL está ativo e as variáveis de ambiente no .env.");
    } else {
      console.log("Conexão com MySQL estabelecida!");
    }

    app.listen(PORT, () => {
      console.log(
        `Backend UneSUS rodando na porta ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Erro ao iniciar o backend:",
      error.message
    );

    await pool.end();
    process.exitCode = 1;
  }
}

iniciarServidor();
