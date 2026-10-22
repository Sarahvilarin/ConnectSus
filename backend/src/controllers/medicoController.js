
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import { validarMedico } from "../validators/medicoValidator.js";

// CADASTRAR MÉDICO
export async function criarMedico(req, res, next) {
  const erros = validarMedico(req.body);

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: "Dados inválidos.",
      erros
    });
  }

  const {
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    crm,
    uf_crm,
    senha,
    especialidades,
    vinculos
  } = req.body;

  let conexao;

  try {
    // Gerar hash antes de iniciar a transação
    const senhaHash = await bcrypt.hash(senha, 12);

    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    // 1. Verificar as especialidades
    for (const especialidadeId of especialidades) {
      const [resultado] = await conexao.query(
        "SELECT id FROM especialidades WHERE id = ?",
        [especialidadeId]
      );

      if (resultado.length === 0) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem: `Especialidade ${especialidadeId} não encontrada.`
        });
      }
    }

    // 2. Verificar os vínculos com unidades e setores
    for (const vinculo of vinculos) {
      const [resultado] = await conexao.query(
        `SELECT us.unidade_id, us.setor_id
         FROM unidade_setores us
         INNER JOIN unidades u
           ON u.id = us.unidade_id
         WHERE us.unidade_id = ?
           AND us.setor_id = ?
           AND u.ativo = TRUE`,
        [vinculo.unidade_id, vinculo.setor_id]
      );

      if (resultado.length === 0) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem:
            `O setor ${vinculo.setor_id} não está disponível ` +
            `na unidade ativa ${vinculo.unidade_id}.`
        });
      }
    }

    // 3. Cadastrar médico
    const [resultado] = await conexao.query(
      `INSERT INTO medicos (
        nome_completo,
        cpf,
        data_nascimento,
        email,
        telefone,
        crm,
        uf_crm,
        senha_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome_completo.trim(),
        cpf,
        data_nascimento,
        email.trim(),
        telefone ?? null,
        crm,
        uf_crm,
        senhaHash
      ]
    );

    const medicoId = resultado.insertId;

    // 4. Cadastrar especialidades do médico
    for (const especialidadeId of especialidades) {
      await conexao.query(
        `INSERT INTO medico_especialidades
         (medico_id, especialidade_id)
         VALUES (?, ?)`,
        [medicoId, especialidadeId]
      );
    }

    // 5. Cadastrar vínculos com unidades e setores
    for (const vinculo of vinculos) {
      await conexao.query(
        `INSERT INTO medico_unidade_setores
         (medico_id, unidade_id, setor_id)
         VALUES (?, ?, ?)`,
        [
          medicoId,
          vinculo.unidade_id,
          vinculo.setor_id
        ]
      );
    }

    // 6. Confirmar todas as operações
    await conexao.commit();

    return res.status(201).json({
      mensagem: "Médico cadastrado com sucesso!",
      medico: {
        id: medicoId,
        nome_completo,
        email,
        crm,
        uf_crm,
        especialidades,
        vinculos
      }
    });

  } catch (error) {
    if (conexao) {
      try {
        await conexao.rollback();
      } catch (rollbackError) {
        console.error("Erro no rollback:", rollbackError);
      }
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CPF, e-mail ou CRM já cadastrado."
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "Especialidade ou vínculo inválido."
      });
    }

    next(error);
  } finally {
    if (conexao) {
      conexao.release();
    }
  }
}


// LISTAR MÉDICOS ATIVOS
export async function listarMedicos(req, res, next) {
  try {
    const [medicos] = await pool.query(`
      SELECT
        id,
        nome_completo,
        crm,
        uf_crm,
        ativo
      FROM medicos
      WHERE ativo = TRUE
      ORDER BY nome_completo ASC
    `);

    return res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
}

// BUSCAR MÉDICO POR ID
export async function buscarMedico(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do médico inválido."
      });
    }

    // Dados principais
    const [medicos] = await pool.query(
      `SELECT
        id,
        nome_completo,
        email,
        telefone,
        crm,
        uf_crm,
        DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS data_nascimento,
        ativo
      FROM medicos
      WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (medicos.length === 0) {
      return res.status(404).json({
        mensagem: "Médico não encontrado."
      });
    }

    // Especialidades
    const [especialidades] = await pool.query(
      `SELECT
        e.id,
        e.nome
      FROM especialidades e
      INNER JOIN medico_especialidades me
        ON me.especialidade_id = e.id
      WHERE me.medico_id = ?
      ORDER BY e.nome ASC`,
      [id]
    );

    // Unidades e setores
    const [vinculos] = await pool.query(
      `SELECT
        u.id AS unidade_id,
        u.nome AS unidade,
        s.id AS setor_id,
        s.nome AS setor
      FROM medico_unidade_setores mus
      INNER JOIN unidades u
        ON u.id = mus.unidade_id
      INNER JOIN setores s
        ON s.id = mus.setor_id
      WHERE mus.medico_id = ?
      ORDER BY u.nome, s.nome`,
      [id]
    );

    return res.status(200).json({
      ...medicos[0],
      especialidades,
      vinculos
    });

  } catch (error) {
    next(error);
  }
}


export async function atualizarMedico(req, res, next) {
  const { id } = req.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      mensagem: "ID do médico inválido."
    });
  }

  const erros = validarMedico(req.body, false);

  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: "Dados inválidos.",
      erros
    });
  }

  const {
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    crm,
    uf_crm,
    senha,
    especialidades,
    vinculos
  } = req.body;

  let conexao;

  try {
    const senhaHash = senha
      ? await bcrypt.hash(senha, 12)
      : null;

    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    // Verificar se o médico existe e bloquear a linha
    const [medicos] = await conexao.query(
      `SELECT id FROM medicos
       WHERE id = ? AND ativo = TRUE
       FOR UPDATE`,
      [id]
    );

    if (medicos.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Médico não encontrado."
      });
    }

    // Validar especialidades existentes
    for (const especialidadeId of especialidades) {
      const [resultado] = await conexao.query(
        "SELECT id FROM especialidades WHERE id = ?",
        [especialidadeId]
      );

      if (resultado.length === 0) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem: `Especialidade ${especialidadeId} não encontrada.`
        });
      }
    }

    // Validar unidades e setores
    for (const vinculo of vinculos) {
      const [resultado] = await conexao.query(
        `SELECT us.unidade_id
         FROM unidade_setores us
         INNER JOIN unidades u
           ON u.id = us.unidade_id
         WHERE us.unidade_id = ?
           AND us.setor_id = ?
           AND u.ativo = TRUE`,
        [vinculo.unidade_id, vinculo.setor_id]
      );

      if (resultado.length === 0) {
        await conexao.rollback();

        return res.status(400).json({
          mensagem: "Unidade ou setor inválido."
        });
      }
    }

    // Atualizar dados pessoais e profissionais
    await conexao.query(
      `UPDATE medicos SET
         nome_completo = ?,
         cpf = ?,
         data_nascimento = ?,
         email = ?,
         telefone = ?,
         crm = ?,
         uf_crm = ?
       WHERE id = ?`,
      [
        nome_completo.trim(),
        cpf,
        data_nascimento,
        email.trim(),
        telefone ?? null,
        crm,
        uf_crm,
        id
      ]
    );

    // Atualizar a senha apenas se foi informada
    if (senhaHash) {
      await conexao.query(
        "UPDATE medicos SET senha_hash = ? WHERE id = ?",
        [senhaHash, id]
      );
    }

    // Substituir as especialidades antigas
    await conexao.query(
      "DELETE FROM medico_especialidades WHERE medico_id = ?",
      [id]
    );

    for (const especialidadeId of especialidades) {
      await conexao.query(
        `INSERT INTO medico_especialidades
         (medico_id, especialidade_id)
         VALUES (?, ?)`,
        [id, especialidadeId]
      );
    }

    // Substituir os vínculos antigos
    await conexao.query(
      "DELETE FROM medico_unidade_setores WHERE medico_id = ?",
      [id]
    );

    for (const vinculo of vinculos) {
      await conexao.query(
        `INSERT INTO medico_unidade_setores
         (medico_id, unidade_id, setor_id)
         VALUES (?, ?, ?)`,
        [id, vinculo.unidade_id, vinculo.setor_id]
      );
    }

    await conexao.commit();

    return res.status(200).json({
      mensagem: "Médico atualizado com sucesso!",
      id: Number(id)
    });

  } catch (error) {
    if (conexao) {
      try {
        await conexao.rollback();
      } catch (rollbackError) {
        console.error("Erro no rollback:", rollbackError);
      }
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensagem: "CPF, e-mail ou CRM já cadastrado."
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "Especialidade ou vínculo inválido."
      });
    }

    next(error);
  } finally {
    if (conexao) conexao.release();
  }
}


// DESATIVAR MÉDICO
export async function excluirMedico(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do médico inválido."
      });
    }

    const [resultado] = await pool.query(
      `UPDATE medicos
       SET ativo = FALSE
       WHERE id = ? AND ativo = TRUE`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Médico não encontrado ou já desativado."
      });
    }

    return res.status(200).json({
      mensagem: "Médico desativado com sucesso!"
    });

  } catch (error) {
    next(error);
  }
}


// REATIVAR MÉDICO
export async function reativarMedico(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensagem: "ID do médico inválido."
      });
    }

    // Verificar se o médico existe e está desativado
    const [medicos] = await pool.query(
      "SELECT id, ativo FROM medicos WHERE id = ?",
      [id]
    );

    if (medicos.length === 0) {
      return res.status(404).json({
        mensagem: "Médico não encontrado."
      });
    }

    if (medicos[0].ativo === 1) {
      return res.status(409).json({
        mensagem: "O médico já está ativo."
      });
    }

    // Reativar o médico
    await pool.query(
      "UPDATE medicos SET ativo = TRUE WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      mensagem: "Médico reativado com sucesso!"
    });

  } catch (error) {
    next(error);
  }
}


// PERFIL DO MÉDICO AUTENTICADO
export async function meuPerfilMedico(req, res, next) {
  try {
    const medicoId = req.medico.id;

    const [especialidades] = await pool.query(
      `SELECT e.id, e.nome
       FROM medico_especialidades me
       INNER JOIN especialidades e
         ON e.id = me.especialidade_id
       WHERE me.medico_id = ?
       ORDER BY e.nome`,
      [medicoId]
    );

    const [vinculos] = await pool.query(
      `SELECT
         u.id AS unidade_id,
         u.nome AS unidade,
         s.id AS setor_id,
         s.nome AS setor
       FROM medico_unidade_setores mus
       INNER JOIN unidades u
         ON u.id = mus.unidade_id
       INNER JOIN setores s
         ON s.id = mus.setor_id
       WHERE mus.medico_id = ?
         AND u.ativo = TRUE
       ORDER BY u.nome, s.nome`,
      [medicoId]
    );

    return res.status(200).json({
      medico: req.medico,
      especialidades,
      vinculos
    });

  } catch (error) {
    next(error);
  }
}


