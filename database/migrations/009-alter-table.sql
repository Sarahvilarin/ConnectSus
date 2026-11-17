-- UneSUS: associa cada atendimento domiciliar ao enfermeiro responsável.
-- Execute uma única vez no banco do projeto, depois de confirmar que a tabela
-- atendimentos_domiciliares e a tabela enfermeiros já existem.

ALTER TABLE atendimentos_domiciliares
  ADD COLUMN enfermeiro_id INT NULL AFTER medico_id,
  ADD INDEX idx_atendimentos_domiciliares_enfermeiro (enfermeiro_id),
  ADD CONSTRAINT fk_atendimentos_domiciliares_enfermeiro
    FOREIGN KEY (enfermeiro_id)
    REFERENCES enfermeiros (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;