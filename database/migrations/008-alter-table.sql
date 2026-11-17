
ALTER TABLE filas
ADD COLUMN medico_id INT NULL AFTER consulta_id,
ADD INDEX idx_filas_medico (medico_id),
ADD CONSTRAINT fk_filas_medico
    FOREIGN KEY (medico_id)
    REFERENCES medicos(id)
    ON DELETE SET NULL;

ALTER TABLE triagens
ADD COLUMN fila_id INT NULL AFTER consulta_id,
ADD UNIQUE INDEX uq_triagem_fila (fila_id),
ADD CONSTRAINT fk_triagem_fila
    FOREIGN KEY (fila_id)
    REFERENCES filas(id)
    ON DELETE SET NULL;
