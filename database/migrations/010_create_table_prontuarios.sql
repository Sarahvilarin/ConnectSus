-- UneSUS: persistência do prontuário médico
-- Faça backup do banco antes de executar.

ALTER TABLE consultas
  MODIFY COLUMN status ENUM('pendente','confirmada','em_atendimento','concluida','cancelada','falta')
  NOT NULL DEFAULT 'pendente';

CREATE TABLE IF NOT EXISTS prontuarios (
  id INT NOT NULL AUTO_INCREMENT,
  consulta_id INT NOT NULL,
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  queixa TEXT NULL,
  historia TEXT NULL,
  alergias TEXT NULL,
  medicamentos TEXT NULL,
  pressao_arterial VARCHAR(20) NULL,
  frequencia_cardiaca DECIMAL(7,2) NULL,
  temperatura DECIMAL(5,2) NULL,
  saturacao_oxigenio DECIMAL(5,2) NULL,
  frequencia_respiratoria DECIMAL(7,2) NULL,
  glicemia DECIMAL(8,2) NULL,
  peso DECIMAL(7,2) NULL,
  altura DECIMAL(7,2) NULL,
  exame_fisico TEXT NULL,
  hipotese_diagnostica TEXT NULL,
  cid VARCHAR(12) NULL,
  conduta TEXT NULL,
  exames_solicitados TEXT NULL,
  retorno_prazo VARCHAR(20) NOT NULL DEFAULT 'Sem retorno',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prontuario_consulta (consulta_id),
  KEY idx_prontuario_paciente (paciente_id),
  KEY idx_prontuario_medico (medico_id),
  CONSTRAINT fk_prontuario_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id),
  CONSTRAINT fk_prontuario_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  CONSTRAINT fk_prontuario_medico FOREIGN KEY (medico_id) REFERENCES medicos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
