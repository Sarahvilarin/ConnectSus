
CREATE TABLE IF NOT EXISTS consultas (
    id INT NOT NULL AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    unidade_id INT NOT NULL,
    especialidade_id INT NOT NULL,
    setor_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    status ENUM(
        'pendente',
        'confirmada',
        'concluida',
        'cancelada',
        'falta'
    ) NOT NULL DEFAULT 'pendente',
    observacoes VARCHAR(1000) DEFAULT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_consultas_paciente_data (paciente_id, data_hora),
    KEY idx_consultas_medico_data (medico_id, data_hora),
    KEY idx_consultas_unidade_data (unidade_id, data_hora),
    KEY idx_consultas_status_data (status, data_hora),

    CONSTRAINT fk_consultas_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id),

    CONSTRAINT fk_consultas_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id),

    CONSTRAINT fk_consultas_unidade
        FOREIGN KEY (unidade_id)
        REFERENCES unidades(id),

    CONSTRAINT fk_consultas_especialidade
        FOREIGN KEY (especialidade_id)
        REFERENCES especialidades(id),

    CONSTRAINT fk_consultas_setor
        FOREIGN KEY (setor_id)
        REFERENCES setores(id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
