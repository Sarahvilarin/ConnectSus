CREATE TABLE IF NOT EXISTS triagens (
    id INT AUTO_INCREMENT PRIMARY KEY,

    paciente_id INT NOT NULL,
    consulta_id INT NULL,
    enfermeiro_id INT NOT NULL,

    queixa_principal TEXT NOT NULL,
    sintomas TEXT,
    inicio_sintomas VARCHAR(100),
    intensidade_dor TINYINT,

    pressao_arterial VARCHAR(20),
    temperatura DECIMAL(4,1),
    frequencia_cardiaca SMALLINT,
    frequencia_respiratoria SMALLINT,
    saturacao_oxigenio DECIMAL(5,2),
    glicemia DECIMAL(6,2),
    peso DECIMAL(6,2),
    altura DECIMAL(5,2),

    classificacao_risco VARCHAR(30) NOT NULL,
    observacoes TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_triagem_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),

    CONSTRAINT fk_triagem_consulta
        FOREIGN KEY (consulta_id) REFERENCES consultas(id),

    CONSTRAINT fk_triagem_enfermeiro
        FOREIGN KEY (enfermeiro_id) REFERENCES enfermeiros(id),

    CONSTRAINT uq_triagem_consulta UNIQUE (consulta_id),

    CONSTRAINT chk_triagem_dor
        CHECK (intensidade_dor IS NULL OR intensidade_dor BETWEEN 0 AND 10),

    INDEX idx_triagem_paciente (paciente_id),
    INDEX idx_triagem_enfermeiro (enfermeiro_id),
    INDEX idx_triagem_data (criado_em)
);