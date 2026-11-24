USE app_db;

START TRANSACTION;

INSERT INTO enfermeiros (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    coren,
    uf_coren,
    senha_hash
)
SELECT
    dados.nome_completo,
    dados.cpf,
    dados.data_nascimento,
    dados.email,
    dados.telefone,
    dados.coren,
    dados.uf_coren,
    (SELECT senha_hash
     FROM enfermeiros
     WHERE id = 1
     LIMIT 1)
FROM (
    SELECT
        'Mariana Oliveira Santos' AS nome_completo,
        '90000000175' AS cpf,
        '1985-03-12' AS data_nascimento,
        'mariana.santos@unesus.com' AS email,
        '11987651001' AS telefone,
        '700001' AS coren,
        'SP' AS uf_coren

    UNION ALL

    SELECT
        'Camila Rodrigues Costa',
        '90000000256',
        '1982-07-21',
        'camila.costa@unesus.com',
        '11987651002',
        '700002',
        'SP'

    UNION ALL

    SELECT
        'Fernanda Almeida Souza',
        '90000000337',
        '1980-11-08',
        'fernanda.souza@unesus.com',
        '11987651003',
        '700003',
        'SP'

    UNION ALL

    SELECT
        'Rafael Martins Ferreira',
        '90000000418',
        '1979-05-16',
        'rafael.ferreira@unesus.com',
        '11987651004',
        '700004',
        'SP'

    UNION ALL

    SELECT
        'Juliana Carvalho Lima',
        '90000000507',
        '1987-09-25',
        'juliana.lima@unesus.com',
        '11987651005',
        '700005',
        'SP'
) AS dados
WHERE NOT EXISTS (
    SELECT 1
    FROM enfermeiros e
    WHERE e.cpf = dados.cpf
       OR e.email = dados.email
       OR (e.coren = dados.coren AND e.uf_coren = dados.uf_coren)
);

COMMIT;