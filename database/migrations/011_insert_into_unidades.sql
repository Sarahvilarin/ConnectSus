INSERT INTO unidades (
    nome,
    cnes,
    tipo_unidade_id,
    rua,
    bairro,
    cep,
    telefone,
    horario_funcionamento,
    servicos_disponiveis,
    ativo
) VALUES (
    'UPA Engenheiro Júlio Marcucci Sobrinho',
    '9408738',
    2,
    'Praça São Lucas, S/N',
    'Santa Paula',
    '09551-340',
    '(11) 4233-7676',
    '24 horas',
    'Urgência e emergência; diagnóstico por imagem; laboratório clínico; eletrocardiograma; oftalmologia.',
    1
);

USE app_db;

INSERT INTO unidades (
    nome,
    cnes,
    tipo_unidade_id,
    rua,
    bairro,
    cep,
    telefone,
    horario_funcionamento,
    servicos_disponiveis,
    ativo
)
SELECT
    novos.nome,
    novos.cnes,
    1,
    novos.rua,
    novos.bairro,
    novos.cep,
    novos.telefone,
    NULL,
    'Atenção básica; consultas médicas; enfermagem; vacinação; prevenção e promoção da saúde.',
    1
FROM (
    SELECT
        'UBS Amélia Richard Locatelli' AS nome,
        '2039389' AS cnes,
        'Alameda João Galego, 01' AS rua,
        'Santa Maria' AS bairro,
        '09560-340' AS cep,
        '(11) 4233-7537' AS telefone

    UNION ALL

    SELECT
        'UBS Caterina Dall Anese',
        '3811565',
        'Rua Prates, 430',
        'Olímpico',
        '09571-030',
        '(11) 4233-7538'

    UNION ALL

    SELECT
        'UBS Darcy Sarmanho Vargas',
        '2032120',
        'Rua General Estilac Leal, 58',
        'Mauá',
        '09580-430',
        '(11) 4233-7539'

    UNION ALL

    SELECT
        'UBS Dr. Ângelo Antenor Zambon',
        '5877121',
        'Rua Vanda, 11',
        'Boa Vista',
        '09572-080',
        '(11) 4233-7536'

    UNION ALL

    SELECT
        'UBS João Luiz Pasqual Bonaparte',
        '6894461',
        'Rua Maranhão, 611',
        'Santa Paula',
        '09541-001',
        '(11) 4233-7552'
) AS novos
WHERE NOT EXISTS (
    SELECT 1
    FROM unidades u
    WHERE u.cnes = novos.cnes
);