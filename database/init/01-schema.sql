```sql
CREATE DATABASE IF NOT EXISTS app_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE app_db;

-- Verificação da API
CREATE TABLE IF NOT EXISTS health_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de unidades públicas
CREATE TABLE IF NOT EXISTS tipos_unidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Unidades de saúde
CREATE TABLE IF NOT EXISTS unidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnes VARCHAR(7) NOT NULL UNIQUE,
    tipo_unidade_id INT NOT NULL,
    rua VARCHAR(150) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    telefone VARCHAR(20),
    horario_funcionamento VARCHAR(255),
    servicos_disponiveis TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (tipo_unidade_id)
        REFERENCES tipos_unidade(id)
);

-- Setores da unidade
CREATE TABLE IF NOT EXISTS setores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Setores disponíveis em cada unidade
CREATE TABLE IF NOT EXISTS unidade_setores (
    unidade_id INT NOT NULL,
    setor_id INT NOT NULL,

    PRIMARY KEY (unidade_id, setor_id),

    FOREIGN KEY (unidade_id)
        REFERENCES unidades(id),

    FOREIGN KEY (setor_id)
        REFERENCES setores(id)
);

-- Especialidades médicas
CREATE TABLE IF NOT EXISTS especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Cadastro dos médicos
CREATE TABLE IF NOT EXISTS medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    crm VARCHAR(20) NOT NULL,
    uf_crm CHAR(2) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (crm, uf_crm)
);

-- Cadastro dos enfermeiros
CREATE TABLE IF NOT EXISTS enfermeiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    coren VARCHAR(20) NOT NULL,
    uf_coren CHAR(2) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (coren, uf_coren)
);

-- Vínculo dos médicos com unidades e setores
CREATE TABLE IF NOT EXISTS medico_unidade_setores (
    medico_id INT NOT NULL,
    unidade_id INT NOT NULL,
    setor_id INT NOT NULL,

    PRIMARY KEY (medico_id, unidade_id, setor_id),

    FOREIGN KEY (medico_id)
        REFERENCES medicos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (unidade_id, setor_id)
        REFERENCES unidade_setores(unidade_id, setor_id)
);

-- Um médico pode possuir várias especialidades
CREATE TABLE IF NOT EXISTS medico_especialidades (
    medico_id INT NOT NULL,
    especialidade_id INT NOT NULL,

    PRIMARY KEY (medico_id, especialidade_id),

    FOREIGN KEY (medico_id)
        REFERENCES medicos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (especialidade_id)
        REFERENCES especialidades(id)
);

-- Cadastro dos pacientes

CREATE TABLE IF NOT EXISTS pacientes (
    id INT NOT NULL AUTO_INCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) DEFAULT NULL,
    senha_hash VARCHAR(255) NOT NULL,

    cep VARCHAR(8) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    complemento VARCHAR(100) DEFAULT NULL,
    sexo VARCHAR(30) NOT NULL,
    cns VARCHAR(15) DEFAULT NULL,
    nome_mae VARCHAR(150) DEFAULT NULL,
    nome_social VARCHAR(150) DEFAULT NULL,

    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_pacientes_cpf (cpf),
    UNIQUE KEY uk_pacientes_email (email),
    UNIQUE KEY uk_pacientes_cns (cns)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;


-- Administradores do sistema UneSUS
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais: tipos de unidades
INSERT IGNORE INTO tipos_unidade (nome) VALUES
('UBS'),
('UPA 24h'),
('CAPS'),
('Hospital Municipal'),
('Pronto Socorro'),
('Policlínica');

-- Dados iniciais: setores
INSERT IGNORE INTO setores (nome) VALUES
('Consulta'),
('Retorno'),
('Urgência'),
('Procedimentos');

-- Dados iniciais: especialidades
INSERT IGNORE INTO especialidades (nome) VALUES
('Clínica Médica'),
('Pediatria'),
('Ginecologia'),
('Obstetrícia'),
('Cardiologia'),
('Dermatologia'),
('Neurologia'),
('Ortopedia'),
('Oftalmologia'),
('Psiquiatria'),
('Endocrinologia'),
('Gastroenterologia'),
('Pneumologia'),
('Urologia'),
('Geriatria'),
('Infectologia'),
('Hematologia'),
('Oncologia'),
('Cirurgia Geral'),
('Cirurgia Vascular');

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
```