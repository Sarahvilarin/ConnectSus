INSERT IGNORE INTO unidade_setores (unidade_id, setor_id)
VALUES
    -- UPA
    (1, 1),
    (1, 3),
    (1, 4),

    -- UBS Amélia
    (2, 1),
    (2, 2),
    (2, 4),

    -- UBS Caterina
    (3, 1),
    (3, 2),
    (3, 4),

    -- UBS Darcy
    (4, 1),
    (4, 2),
    (4, 4),

    -- UBS Ângelo
    (5, 1),
    (5, 2),
    (5, 4),

    -- UBS João Luiz
    (6, 1),
    (6, 2),
    (6, 4);

    INSERT IGNORE INTO medico_unidade_setores
    (medico_id, unidade_id, setor_id)
VALUES
    (1, 1, 1);