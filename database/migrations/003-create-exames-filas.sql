
CREATE TABLE IF NOT EXISTS exames (
    id INT NOT NULL AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    unidade_id INT NOT NULL,
    consulta_id INT DEFAULT NULL,
    tipo_exame VARCHAR(150) NOT NULL,
    observacoes VARCHAR(1000) DEFAULT NULL,
    status ENUM(
        'solicitado',
        'agendado',
        'em_andamento',
        'concluido',
        'cancelado'
    ) NOT NULL DEFAULT 'solicitado',
    resultado TEXT DEFAULT NULL,
    data_agendada DATETIME DEFAULT NULL,
    data_resultado DATETIME DEFAULT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_exames_paciente_status (paciente_id, status),
    KEY idx_exames_medico_status (medico_id, status),
    KEY idx_exames_unidade_status (unidade_id, status),

    CONSTRAINT fk_exames_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_exames_medico
        FOREIGN KEY (medico_id) REFERENCES medicos(id),
    CONSTRAINT fk_exames_unidade
        FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    CONSTRAINT fk_exames_consulta
        FOREIGN KEY (consulta_id) REFERENCES consultas(id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS filas (
    id INT NOT NULL AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    unidade_id INT NOT NULL,
    setor_id INT NOT NULL,
    consulta_id INT DEFAULT NULL,
    status ENUM(
        'aguardando',
        'chamado',
        'em_atendimento',
        'concluido',
        'desistente',
        'cancelado'
    ) NOT NULL DEFAULT 'aguardando',
    prioridade ENUM('normal', 'preferencial', 'urgente')
        NOT NULL DEFAULT 'normal',
    posicao INT DEFAULT NULL,
    entrada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    chamada_em DATETIME DEFAULT NULL,
    inicio_atendimento_em DATETIME DEFAULT NULL,
    fim_atendimento_em DATETIME DEFAULT NULL,
    atualizado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_filas_unidade_setor_status (unidade_id, setor_id, status),
    KEY idx_filas_paciente_status (paciente_id, status),
    KEY idx_filas_entrada (entrada_em),

    CONSTRAINT fk_filas_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_filas_unidade
        FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    CONSTRAINT fk_filas_setor
        FOREIGN KEY (setor_id) REFERENCES setores(id),
    CONSTRAINT fk_filas_consulta
        FOREIGN KEY (consulta_id) REFERENCES consultas(id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
