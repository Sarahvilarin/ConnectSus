-- Paciente

USE app_db;

INSERT INTO pacientes (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    senha_hash,
    ativo,
    cep,
    rua,
    numero,
    bairro,
    cidade,
    complemento,
    sexo,
    nome_mae
) VALUES (
    'João Pedro da Silva',
    '12345678901',
    '2000-05-15',
    'joao.pedro@email.com',
    '11987654321',
    '$2b$10$kRkxCj0DPfNFmQz3MsZNWuDrHtJFQIuYq8EpY9tI4muhRcJLKC/E.',
    1,
    '09510000',
    'Rua das Flores',
    '125',
    'Centro',
    'São Caetano do Sul',
    'Apto 12',
    'Masculino',
    'Maria Aparecida da Silva'
);

-- Medico

USE app_db;

INSERT INTO medicos (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    crm,
    uf_crm,
    senha_hash,
    ativo
) VALUES (
    'Dr. Rafael Henrique Oliveira',
    '98765432100',
    '1985-08-20',
    'rafael.oliveira@unesus.com',
    '11991234567',
    '123456',
    'SP',
    '$2b$10$No4hSZVU33ufSUyDazzP0OqFH0ByWFiRxxVyEl0mZ8lUr.O0GyA3m',
    1
);

-- Admin

USE app_db;

INSERT INTO administradores (
    nome,
    email,
    senha_hash,
    ativo
) VALUES (
    'Gabriel Henrique Santos',
    'gabriel.admin@unesus.com',
    '$2b$10$KH0AhpSmept6CwxjT0ezc.gFhZFywzw1Co.D3a55E2ZoJAlIsvpKO',
    1
);

-- Enfermeiro

USE app_db;

INSERT INTO enfermeiros (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    coren,
    uf_coren,
    senha_hash,
    ativo
) VALUES (
    'Lucas Eduardo Martins',
    '32165498700',
    '1992-03-12',
    'lucas.martins@unesus.com',
    '11987654321',
    '123456',
    'SP',
    '$2b$10$Le.kA7/W5UYN7aH.P5oHROa9xVsIo6QgHLIh/C4DmSu1qeIl1wESW',
    1
);