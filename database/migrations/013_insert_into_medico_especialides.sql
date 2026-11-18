INSERT INTO medico_especialidades (
    medico_id,
    especialidade_id
)
SELECT 1, 1
WHERE NOT EXISTS (
    SELECT 1
    FROM medico_especialidades
    WHERE medico_id = 1
      AND especialidade_id = 1
);