# UneSUS — API Backend

Documentação dos endpoints atualmente registrados no backend do UneSUS.

- **Base URL local:** `http://localhost:8080`
- **Prefixo:** `/api`
- **Formato:** JSON
- **Autenticação:** JWT no cabeçalho `Authorization: Bearer SEU_TOKEN`.
- **CORS:** origem definida por `FRONTEND_URL`; padrão `http://localhost:3000`.

> Métodos, caminhos e níveis de autenticação foram extraídos dos arquivos de rotas e de `app.js`. Os formatos completos dos corpos das requisições e respostas não foram presumidos; consulte os controllers e validators correspondentes.

## Perfis de acesso

- **Público:** não exige token.
- **Administrador:** exige token administrativo.
- **Médico:** exige token de médico.
- **Enfermeiro:** exige token de enfermeiro.
- **Paciente:** exige token de paciente.

## 1. Health check — `/api/health`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/health/` | Público | Verifica o estado da API. |

## 2. Autenticação — `/api/auth`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/admin/login` | Público | Login administrativo. |
| POST | `/api/auth/medico/login` | Público | Login de médico ou enfermeiro. |
| POST | `/api/auth/paciente/login` | Público | Login de paciente. |

## 3. Unidades — `/api/unidades`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/unidades/` | Público | Lista unidades. |
| GET | `/api/unidades/:id` | Público | Busca unidade por ID. |
| POST | `/api/unidades/` | Administrador | Cadastra unidade. |
| PUT | `/api/unidades/:id` | Administrador | Atualiza unidade. |
| DELETE | `/api/unidades/:id` | Administrador | Exclui unidade. |
| GET | `/api/unidades/:id/especialidades` | Público | Lista especialidades da unidade. |

## 4. Especialidades — `/api/especialidades`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/especialidades/` | Público | Lista especialidades. |
| GET | `/api/especialidades/:id` | Público | Busca especialidade por ID. |
| POST | `/api/especialidades/` | Administrador | Cadastra especialidade. |
| PUT | `/api/especialidades/:id` | Administrador | Atualiza especialidade. |

## 5. Setores — `/api/setores`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/setores/` | Público | Lista setores. |
| GET | `/api/setores/unidade/:id` | Público | Lista setores de uma unidade. |
| POST | `/api/setores/` | Administrador | Cadastra setor. |
| PUT | `/api/setores/:id` | Administrador | Atualiza setor. |
| POST | `/api/setores/unidade/:id/:setorId` | Administrador | Vincula setor à unidade. |
| DELETE | `/api/setores/unidade/:id/:setorId` | Administrador | Desvincula setor da unidade. |

## 6. Médicos — `/api/medicos`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/medicos/me` | Médico | Perfil do médico autenticado. |
| GET | `/api/medicos/` | Administrador | Lista médicos. |
| GET | `/api/medicos/:id` | Administrador | Busca médico por ID. |
| POST | `/api/medicos/` | Administrador | Cadastra médico. |
| PUT | `/api/medicos/:id` | Administrador | Atualiza médico. |
| DELETE | `/api/medicos/:id` | Administrador | Exclui/desativa médico conforme controller. |
| PATCH | `/api/medicos/:id/reativar` | Administrador | Reativa médico. |

## 7. Enfermeiros — `/api/enfermeiros`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/enfermeiros/me` | Enfermeiro | Perfil do enfermeiro autenticado. |
| GET | `/api/enfermeiros/` | Administrador | Lista enfermeiros. |
| GET | `/api/enfermeiros/:id` | Administrador | Busca enfermeiro por ID. |
| POST | `/api/enfermeiros/` | Administrador | Cadastra enfermeiro. |
| PUT | `/api/enfermeiros/:id` | Administrador | Atualiza enfermeiro. |
| DELETE | `/api/enfermeiros/:id` | Administrador | Desativa enfermeiro conforme controller. |
| PATCH | `/api/enfermeiros/:id/reativar` | Administrador | Reativa enfermeiro. |

## 8. Triagens — `/api/triagens`

Todas as rotas abaixo exigem autenticação de enfermeiro no código atual.

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/triagens/` | Enfermeiro | Registra triagem. |
| GET | `/api/triagens/` | Enfermeiro | Lista triagens. |
| GET | `/api/triagens/:id` | Enfermeiro | Busca triagem por ID. |
| GET | `/api/triagens/paciente/:pacienteId` | Enfermeiro | Lista triagens de um paciente. |
| PATCH | `/api/triagens/:id/consulta` | Enfermeiro | Vincula triagem a uma consulta. |

## 9. Pacientes — `/api/pacientes`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/pacientes/` | Público | Cadastra paciente. |
| GET | `/api/pacientes/me` | Paciente | Perfil do paciente autenticado. |
| PUT | `/api/pacientes/me` | Paciente | Atualiza perfil do paciente. |
| PATCH | `/api/pacientes/me/senha` | Paciente | Altera senha do paciente. |

## 10. Consultas — `/api/consultas`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/consultas/` | Paciente | Solicita consulta. |
| GET | `/api/consultas/me` | Paciente | Lista consultas do paciente autenticado. |
| PATCH | `/api/consultas/:id/cancelar` | Paciente | Cancela consulta do paciente. |
| PATCH | `/api/consultas/:id/confirmar` | Médico | Confirma consulta. |
| GET | `/api/consultas/medico/me` | Médico | Lista consultas do médico autenticado. |
| PATCH | `/api/consultas/:id/concluir` | Médico | Conclui consulta. |
| GET | `/api/consultas/:id/triagem` | Médico | Busca triagem vinculada à consulta, validando o vínculo com o médico. |

## 11. Exames — `/api/exames`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/exames/` | Paciente | Solicita exame. |
| GET | `/api/exames/me` | Paciente | Lista exames do paciente autenticado. |
| GET | `/api/exames/medico/me` | Médico | Lista exames do médico autenticado. |
| PATCH | `/api/exames/:id/status` | Médico | Atualiza status do exame. |
| PATCH | `/api/exames/:id/resultado` | Médico | Registra resultado do exame. |
| GET | `/api/exames/` | Administrador | Lista exames. |
| GET | `/api/exames/:id` | Administrador | Busca exame por ID. |

## 12. Filas — `/api/filas`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/filas/` | Paciente | Insere paciente em uma fila. |
| GET | `/api/filas/me` | Paciente | Lista entradas de fila do paciente. |
| PATCH | `/api/filas/:id/cancelar` | Paciente | Cancela entrada na fila. |
| PATCH | `/api/filas/:id/checkin` | Paciente | Realiza check-in. |
| GET | `/api/filas/medico/me` | Médico | Lista fila do médico autenticado. |
| PATCH | `/api/filas/:id/status` | Médico | Atualiza status de entrada na fila. |
| GET | `/api/filas/` | Administrador | Lista filas para administração. |

## 13. Atendimentos domiciliares — `/api/atendimentos-domiciliares`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/atendimentos-domiciliares/` | Paciente | Solicita atendimento domiciliar. |
| GET | `/api/atendimentos-domiciliares/paciente/me` | Paciente | Lista atendimentos do paciente. |
| PATCH | `/api/atendimentos-domiciliares/:id/cancelar` | Paciente | Cancela solicitação. |
| GET | `/api/atendimentos-domiciliares/unidade` | Médico | Lista atendimentos da unidade conforme controller. |
| GET | `/api/atendimentos-domiciliares/:id` | Médico | Busca atendimento por ID. |
| PATCH | `/api/atendimentos-domiciliares/:id/agendar` | Médico | Agenda atendimento. |
| PATCH | `/api/atendimentos-domiciliares/:id/status` | Médico | Atualiza status do atendimento. |

**Atenção:** essas rotas estão protegidas por autenticação de médico no código atual. Se o fluxo do projeto determina que atendimentos domiciliares sejam executados por enfermeiros, a autorização e a implementação precisam ser ajustadas.

## 14. Dashboard administrativo — `/api/dashboard`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/dashboard/admin` | Administrador | Retorna dados do dashboard administrativo. |

## Endpoints não montados

Existe um arquivo `dashboardMedicoRoutes.js`, mas `app.js` não o importa nem registra um prefixo para ele. Portanto, não há endpoint de dashboard médico disponível pela aplicação conforme a configuração atual.

## Códigos HTTP

Os códigos exatos dependem de cada controller. Códigos comuns:

| Código | Significado |
|---|---|
| 200 | Requisição concluída. |
| 201 | Recurso criado. |
| 400 | Dados inválidos ou requisição malformada. |
| 401 | Token ausente ou inválido. |
| 403 | Perfil sem permissão. |
| 404 | Recurso ou rota não encontrado. |
| 409 | Conflito com registro ou estado existente. |
| 500 | Erro interno do servidor. |

## Observações

- `:id`, `:pacienteId` e `:setorId` são parâmetros dinâmicos da URL.
- Os corpos das requisições e os formatos das respostas devem ser consultados nos controllers e validators de cada módulo.
- Esta lista considera apenas os routers efetivamente montados em `backend/src/app.js`.
- Não inclua senhas, hashes ou tokens em documentação pública ou logs.
