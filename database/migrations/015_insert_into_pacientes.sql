USE app_db;

START TRANSACTION;

SET @senha_hash = '$2b$12$RKeRrKjWFg/yl6lxzskkGOQAY.doYE2onXmiPpI41v2dMXO7pXA1G';

INSERT INTO pacientes (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    senha_hash,
    cep,
    rua,
    numero,
    bairro,
    cidade,
    complemento,
    sexo,
    cns,
    nome_mae,
    nome_social
) VALUES
(
    'Mariana Oliveira Santos',
    '12345678909',
    '1995-04-12',
    'mariana.santos@email.com',
    '(11) 98765-1001',
    @senha_hash,
    '09510000',
    'Rua das Flores',
    '120',
    'Centro',
    'São Caetano do Sul',
    NULL,
    'feminino',
    NULL,
    'Ana Oliveira Santos',
    NULL
),
(
    'Lucas Ferreira Costa',
    '23456789092',
    '1988-09-23',
    'lucas.costa@email.com',
    '(11) 98765-1002',
    @senha_hash,
    '09520000',
    'Rua Amazonas',
    '245',
    'Santa Paula',
    'São Caetano do Sul',
    'Apartamento 12',
    'masculino',
    NULL,
    'Maria Ferreira Costa',
    NULL
),
(
    'Beatriz Almeida Rocha',
    '34567890175',
    '2001-02-08',
    'beatriz.rocha@email.com',
    '(11) 98765-1003',
    @senha_hash,
    '09530000',
    'Rua Alegre',
    '85',
    'Barcelona',
    'São Caetano do Sul',
    NULL,
    'feminino',
    NULL,
    'Claudia Almeida Rocha',
    NULL
),
(
    'Gabriel Mendes Ribeiro',
    '45678901249',
    '1979-11-17',
    'gabriel.ribeiro@email.com',
    '(11) 98765-1004',
    @senha_hash,
    '09540000',
    'Avenida Goiás',
    '560',
    'Santo Antônio',
    'São Caetano do Sul',
    NULL,
    'masculino',
    NULL,
    'Helena Mendes Ribeiro',
    NULL
),
(
    'Isabela Martins Carvalho',
    '56789012303',
    '1992-06-30',
    'isabela.carvalho@email.com',
    '(11) 98765-1005',
    @senha_hash,
    '09550000',
    'Rua São Paulo',
    '310',
    'Cerâmica',
    'São Caetano do Sul',
    'Casa 2',
    'feminino',
    NULL,
    'Patricia Martins Carvalho',
    NULL
),
(
    'Rafael Nogueira Lima',
    '67890123469',
    '1985-12-05',
    'rafael.lima@email.com',
    '(11) 98765-1006',
    @senha_hash,
    '09560000',
    'Rua Maranhão',
    '175',
    'Oswaldo Cruz',
    'São Caetano do Sul',
    NULL,
    'masculino',
    NULL,
    'Sandra Nogueira Lima',
    NULL
);

COMMIT;

SELECT id, nome_completo, cpf, email, ativo
FROM pacientes
ORDER BY id DESC
LIMIT 6;