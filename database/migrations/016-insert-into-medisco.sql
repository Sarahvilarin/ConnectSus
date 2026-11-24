USE app_db;

START TRANSACTION;

-- Médicos fictícios para ambiente de desenvolvimento
CREATE TEMPORARY TABLE tmp_medicos (
    especialidade_id INT PRIMARY KEY,
    nome_completo VARCHAR(150),
    cpf VARCHAR(11),
    data_nascimento DATE,
    email VARCHAR(150),
    telefone VARCHAR(11),
    crm VARCHAR(20),
    uf_crm VARCHAR(2),
    unidade_id INT,
    setor_id INT
);

INSERT INTO tmp_medicos VALUES
(2, 'Mariana Oliveira Santos', '90000000175', '1985-03-12', 'mariana.pediatria@unesus.com.br', '11987651001', '9000002', 'SP', 2, 1),
(3, 'Camila Rodrigues Costa', '90000000256', '1982-07-21', 'camila.ginecologia@unesus.com.br', '11987651002', '9000003', 'SP', 3, 1),
(4, 'Fernanda Almeida Souza', '90000000337', '1980-11-08', 'fernanda.obstetricia@unesus.com.br', '11987651003', '9000004', 'SP', 4, 1),
(5, 'Rafael Martins Ferreira', '90000000418', '1979-05-16', 'rafael.cardiologia@unesus.com.br', '11987651004', '9000005', 'SP', 5, 1),
(6, 'Juliana Carvalho Lima', '90000000507', '1987-09-25', 'juliana.dermatologia@unesus.com.br', '11987651005', '9000006', 'SP', 6, 1),
(7, 'Bruno Pereira Mendes', '90000000680', '1981-01-14', 'bruno.neurologia@unesus.com.br', '11987651006', '9000007', 'SP', 2, 1),
(8, 'Lucas Barbosa Ribeiro', '90000000760', '1984-06-19', 'lucas.ortopedia@unesus.com.br', '11987651007', '9000008', 'SP', 3, 1),
(9, 'Ana Beatriz Gomes', '90000000841', '1986-04-03', 'ana.oftalmologia@unesus.com.br', '11987651008', '9000009', 'SP', 4, 1),
(10, 'Gabriel Nunes Rocha', '90000000922', '1978-12-11', 'gabriel.psiquiatria@unesus.com.br', '11987651009', '9000010', 'SP', 5, 1),
(11, 'Patricia Moreira Alves', '90000001066', '1983-08-27', 'patricia.endocrinologia@unesus.com.br', '11987651010', '9000011', 'SP', 6, 1),
(12, 'Thiago Castro Almeida', '90000001147', '1980-02-09', 'thiago.gastro@unesus.com.br', '11987651011', '9000012', 'SP', 2, 1),
(13, 'Carolina Mendes Silva', '90000001228', '1988-10-17', 'carolina.pneumologia@unesus.com.br', '11987651012', '9000013', 'SP', 3, 1),
(14, 'Eduardo Lima Costa', '90000001309', '1977-03-29', 'eduardo.urologia@unesus.com.br', '11987651013', '9000014', 'SP', 4, 1),
(15, 'Roberta Fernandes Dias', '90000001490', '1975-07-06', 'roberta.geriatria@unesus.com.br', '11987651014', '9000015', 'SP', 5, 1),
(16, 'André Luiz Carvalho', '90000001570', '1982-09-13', 'andre.infectologia@unesus.com.br', '11987651015', '9000016', 'SP', 6, 1),
(17, 'Vanessa Ribeiro Martins', '90000001651', '1981-12-22', 'vanessa.hematologia@unesus.com.br', '11987651016', '9000017', 'SP', 2, 1),
(18, 'Marcelo Souza Oliveira', '90000001732', '1979-04-18', 'marcelo.oncologia@unesus.com.br', '11987651017', '9000018', 'SP', 3, 1),
(19, 'Daniela Costa Pereira', '90000001813', '1985-06-30', 'daniela.cirurgia@unesus.com.br', '11987651018', '9000019', 'SP', 4, 1),
(20, 'Felipe Gomes Santos', '90000001902', '1983-11-15', 'felipe.vascular@unesus.com.br', '11987651019', '9000020', 'SP', 5, 1);

-- Insere somente médicos de especialidades sem médico ativo.
INSERT INTO medicos (
    nome_completo,
    cpf,
    data_nascimento,
    email,
    telefone,
    crm,
    uf_crm,
    senha_hash
)
SELECT
    t.nome_completo,
    t.cpf,
    t.data_nascimento,
    t.email,
    t.telefone,
    t.crm,
    t.uf_crm,
    (SELECT senha_hash
     FROM medicos
     WHERE ativo = TRUE
     ORDER BY id
     LIMIT 1)
FROM tmp_medicos t
WHERE NOT EXISTS (
    SELECT 1
    FROM medico_especialidades me
    INNER JOIN medicos m ON m.id = me.medico_id
    WHERE me.especialidade_id = t.especialidade_id
      AND m.ativo = TRUE
)
AND NOT EXISTS (
    SELECT 1
    FROM medicos existente
    WHERE existente.cpf = t.cpf
       OR (existente.crm = t.crm AND existente.uf_crm = t.uf_crm)
);

-- Vincula cada médico à sua especialidade.
INSERT INTO medico_especialidades (medico_id, especialidade_id)
SELECT m.id, t.especialidade_id
FROM tmp_medicos t
INNER JOIN medicos m ON m.cpf = t.cpf
WHERE NOT EXISTS (
    SELECT 1
    FROM medico_especialidades me
    WHERE me.medico_id = m.id
      AND me.especialidade_id = t.especialidade_id
);

-- Vincula cada médico à unidade e ao setor de consulta.
INSERT INTO medico_unidade_setores (medico_id, unidade_id, setor_id)
SELECT m.id, t.unidade_id, t.setor_id
FROM tmp_medicos t
INNER JOIN medicos m ON m.cpf = t.cpf
INNER JOIN unidade_setores us
    ON us.unidade_id = t.unidade_id
   AND us.setor_id = t.setor_id
INNER JOIN unidades u
    ON u.id = us.unidade_id
   AND u.ativo = TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM medico_unidade_setores mus
    WHERE mus.medico_id = m.id
      AND mus.unidade_id = t.unidade_id
      AND mus.setor_id = t.setor_id
);

DROP TEMPORARY TABLE tmp_medicos;

COMMIT;