"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

const ASSUNTOS = [
  { valor: "conta", texto: "Problema com minha conta" },
  { valor: "fila", texto: "Dúvida sobre fila online" },
  { valor: "consulta", texto: "Dúvida sobre consultas" },
  { valor: "exame", texto: "Dúvida sobre exames" },
  { valor: "unidade", texto: "Informações sobre unidades" },
  { valor: "acessibilidade", texto: "Acessibilidade" },
  { valor: "sugestao", texto: "Sugestão" },
  { valor: "outro", texto: "Outro assunto" },
];

export default function ContatoPage() {
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const [aviso, setAviso] = useState("");

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setAviso("");
  }

  function escolherAssunto(valor) {
    setFormulario((anterior) => ({
      ...anterior,
      assunto: valor,
    }));

    setAviso("");
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (!formulario.assunto) {
      setAviso("Selecione como podemos ajudar antes de enviar.");
      return;
    }

    // A página ainda não está conectada ao backend.
    setAviso(
      "O formulário está pronto, mas o envio de mensagens ainda não está disponível."
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* Decorações */}
      <div className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full bg-white/60" />

      <div className="pointer-events-none absolute -bottom-44 -left-32 h-[400px] w-[400px] rounded-full border-[55px] border-white/60" />

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <section className="mb-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-[#0B1756] sm:text-4xl lg:whitespace-nowrap lg:text-5xl">
              Estamos aqui para{" "}
              <span className="bg-gradient-to-r from-[#023E8A] to-[#3563A7] bg-clip-text text-transparent">
                ajudar você.
              </span>
            </h1>

            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#023E8A] to-[#A9D3F5]" />

            <p className="mt-4 text-base font-normal leading-7 text-slate-600 lg:whitespace-nowrap">
              Tire dúvidas, envie sugestões ou fale com nossa equipe sobre o
              uso da plataforma.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#3563A7]">
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-xs font-normal text-slate-500">
                Horário de atendimento
              </p>
              <p className="text-base font-semibold text-[#0B1756]">
                Segunda a sexta, das 8h às 17h
              </p>
            </div>
          </div>
        </section>

        {/* Bloco principal */}
        <section className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          {/* Imagem */}
          <div className="relative hidden min-h-[650px] overflow-hidden lg:block">
            <Image
              src="/contato-saude.jpg"
              alt="Profissional de saúde atendendo paciente"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1756]/95 via-[#023E8A]/35 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 xl:p-10">
              <h2 className="max-w-md text-2xl font-bold leading-tight text-white">
                Informação também faz parte do cuidado.
              </h2>

              <p className="mt-3 max-w-md text-sm font-normal leading-6 text-[#EAF3F7]">
                Nossa equipe está disponível para orientar sobre acesso,
                funcionalidades e serviços do UneSUS.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-white/20 pt-4">
                <ContatoImagem
                  icon={<Phone size={16} />}
                  valor="(11) 0000-0000"
                />

                <ContatoImagem
                  icon={<Mail size={16} />}
                  valor="contato@unesus.com.br"
                />

                <ContatoImagem
                  icon={<MapPin size={16} />}
                  valor="São Caetano do Sul - SP"
                />
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="flex min-h-[650px] items-center px-5 py-7 sm:px-8 lg:px-10 xl:px-12">
            <div className="w-full">
              <h2 className="text-2xl font-bold leading-tight text-[#0B1756]">
                Envie uma mensagem
              </h2>

              <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                Preencha os campos abaixo. Informe o máximo de detalhes
                possível para facilitar o atendimento.
              </p>

              <form onSubmit={enviarFormulario} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo
                    label="Nome completo"
                    name="nome"
                    value={formulario.nome}
                    onChange={alterarCampo}
                    placeholder="Digite seu nome"
                  />

                  <Campo
                    label="E-mail"
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={alterarCampo}
                    placeholder="exemplo@email.com"
                  />
                </div>

                {/* Assunto */}
                <div className="mt-4">
                  <label
                    id="rotulo-assunto"
                    className="mb-1.5 block text-xs font-semibold text-[#0B1756]"
                  >
                    Como podemos ajudar?
                  </label>

                  <Selecao
                    rotuloId="rotulo-assunto"
                    valor={formulario.assunto}
                    opcoes={ASSUNTOS}
                    onChange={escolherAssunto}
                    placeholder="Selecione uma opção"
                  />
                </div>

                {/* Mensagem */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="mensagem"
                      className="text-xs font-semibold text-[#0B1756]"
                    >
                      Mensagem
                    </label>

                    <span className="text-xs font-normal text-slate-500">
                      {formulario.mensagem.length}/500
                    </span>
                  </div>

                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formulario.mensagem}
                    onChange={alterarCampo}
                    placeholder="Conte para nós como podemos ajudar..."
                    required
                    maxLength={500}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-[#EEF5F9] px-4 py-3 text-sm font-normal leading-6 text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                  />
                </div>

                {/* Segurança */}
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-[#EAF3F7] p-3.5">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#023E8A]"
                  />

                  <p className="text-xs font-normal leading-5 text-slate-600">
                    Não envie senhas, informações bancárias ou outros dados
                    confidenciais nesta mensagem.
                  </p>
                </div>

                {/* Aviso */}
                {aviso && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl border border-[#3563A7]/30 bg-[#EAF3F7] p-3 text-sm font-normal leading-5 text-[#0B1756]"
                  >
                    {aviso}
                  </p>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#023E8A] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0B1756] hover:shadow-md"
                >
                  <Send size={17} />
                  Enviar mensagem
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* Campo reutilizável */
function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-[#0B1756]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="h-12 w-full rounded-xl border border-slate-200 bg-[#EEF5F9] px-4 text-sm font-normal text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
      />
    </div>
  );
}

/* Lista de seleção personalizada */
function Selecao({ rotuloId, valor, opcoes, onChange, placeholder }) {
  const [aberta, setAberta] = useState(false);

  const atual = opcoes.find((opcao) => opcao.valor === valor);

  return (
    <div
      className="relative"
      onKeyDown={(event) => event.key === "Escape" && setAberta(false)}
    >
      <button
        type="button"
        aria-labelledby={rotuloId}
        aria-haspopup="listbox"
        aria-expanded={aberta}
        onClick={() => setAberta(!aberta)}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm font-normal outline-none transition ${
          aberta
            ? "border-[#023E8A] bg-white ring-4 ring-[#023E8A]/15"
            : "border-slate-200 bg-[#EEF5F9] hover:border-[#3563A7]"
        } ${atual ? "text-[#0B1756]" : "text-slate-400"}`}
      >
        <span className="min-w-0 truncate">
          {atual ? atual.texto : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${
            aberta ? "rotate-180 text-[#023E8A]" : ""
          }`}
        />
      </button>

      {aberta && (
        <>
          <button
            type="button"
            aria-label="Fechar lista"
            onClick={() => setAberta(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div
            role="listbox"
            aria-labelledby={rotuloId}
            className="absolute left-0 top-full z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
          >
            {opcoes.map((opcao) => {
              const ativo = opcao.valor === valor;

              return (
                <button
                  key={opcao.valor}
                  type="button"
                  role="option"
                  aria-selected={ativo}
                  onClick={() => {
                    onChange(opcao.valor);
                    setAberta(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                    ativo
                      ? "bg-[#023E8A] font-semibold text-white"
                      : "font-normal text-[#0B1756] hover:bg-[#EAF3F7]"
                  }`}
                >
                  <span>{opcao.texto}</span>

                  {ativo && <Check size={16} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* Contatos sobre a imagem (versão compacta) */
function ContatoImagem({ icon, valor }) {
  return (
    <div className="flex items-center gap-2.5 text-white">
      <span className="shrink-0 text-[#EAF3F7]">{icon}</span>

      <p className="text-sm font-semibold">{valor}</p>
    </div>
  );
}