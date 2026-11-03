CREATE TABLE atendimentos_domiciliares (
    id INT AUTO_INCREMENT PRIMARY KEY,

    paciente_id INT NOT NULL,
    unidade_id INT NOT NULL,
    medico_id INT DEFAULT NULL,

    motivo VARCHAR(1000) NOT NULL,

    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    complemento VARCHAR(100) DEFAULT NULL,

    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_agendada DATETIME DEFAULT NULL,
    data_conclusao DATETIME DEFAULT NULL,

    status ENUM(
        'solicitado',
        'agendado',
        'em_andamento',
        'concluido',
        'cancelado'
    ) NOT NULL DEFAULT 'solicitado',

    observacoes VARCHAR(1000) DEFAULT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_domiciliar_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),

    CONSTRAINT fk_domiciliar_unidade
        FOREIGN KEY (unidade_id) REFERENCES unidades(id),

    CONSTRAINT fk_domiciliar_medico
        FOREIGN KEY (medico_id) REFERENCES medicos(id)
);