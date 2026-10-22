"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { QRCodeSVG } from "qrcode.react";

import {
  UsersRound,
  MapPin,
  Clock,
  UserRound,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  X,
  Navigation,
  Search,
  XCircle,
  Stethoscope,
  QrCode,
} from "lucide-react";

// ======================================================
// CONFIGURAÇÕES
// ======================================================

// Imagem fixa do card principal (arquivo em /public/sus.png)
const FOTO_SUS = "/sus-filaOnline.png";

// Quantidade máxima de unidades exibidas na lista
const LIMITE_UNIDADES = 5;

// ======================================================
// UNIDADES DE SAÚDE
// ======================================================

const unidades = [
  {
    id: 1,
    nome: "UPA Bangu",
    espera: 12,
    servicos: ["Clínico geral", "Pediatria", "Ginecologia"],
    tipo: "normal",
    endereco: "Rua Avaré, 107 — Vila São Pedro, Santo André",
  },
  {
    id: 2,
    nome: "UBS Vila Aliança",
    espera: 25,
    servicos: ["Clínico geral", "Odontologia", "Pediatria"],
    tipo: "rapida",
    endereco: "Rua do Governo, 450 — Bangu, Rio de Janeiro",
  },
  {
    id: 3,
    nome: "UPA Realengo",
    espera: 45,
    servicos: ["Clínico geral", "Ortopedia", "Pediatria"],
    tipo: "normal",
    endereco: "Av. Brasil, 28000 — Realengo, Rio de Janeiro",
  }
];

// ======================================================
// ILUSTRAÇÃO DOS CARDS DAS UNIDADES
// ======================================================

function UnidadeFoto({ unidade, destaque = false }) {
  // No card de destaque (fila) a imagem é fixa, vinda de /public/sus.png
  const [foto, setFoto] = useState(destaque ? FOTO_SUS : "");
  const [atribuicao, setAtribuicao] = useState(null);

  useEffect(() => {
    // Card de destaque usa a imagem fixa, não busca no Google
    if (destaque) return;

    let cancelado = false;

    async function buscarFoto() {
      try {
        if (!window.google?.maps?.importLibrary) return;

        const { Place } = await window.google.maps.importLibrary("places");
        const resposta = await Place.searchByText({
          textQuery: `${unidade.nome}, ${unidade.endereco}, Brasil`,
          fields: ["displayName", "formattedAddress", "photos"],
          maxResultCount: 1,
          language: "pt-BR",
          region: "BR",
        });

        const local = resposta.places?.[0];
        const fotoGoogle = local?.photos?.[0];

        if (!fotoGoogle || cancelado) return;

        const urlFoto = fotoGoogle.getURI({ maxWidth: 500, maxHeight: 350 });
        const autores = fotoGoogle.authorAttributions || [];
        const autor = autores[0];

        if (!cancelado && urlFoto) {
          setFoto(urlFoto);
          setAtribuicao(
            autor
              ? {
                  nome: autor.displayName || "Google Maps",
                  url: autor.uri || "",
                }
              : { nome: "Google Maps", url: "" }
          );
        }
      } catch (erro) {
        console.warn(`Não foi possível buscar foto de ${unidade.nome}:`, erro);
      }
    }

    buscarFoto();

    return () => {
      cancelado = true;
    };
  }, [unidade.nome, unidade.endereco, destaque]);

  if (destaque) {
    return (
      <div className="relative isolate flex min-h-[170px] overflow-hidden rounded-2xl bg-[#EAF3FF]">
        {foto && (
          <img
            src={foto}
            alt={`Foto da unidade ${unidade.nome}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(90deg, #EDF5FF 0%, #EDF5FF 25%, rgba(237,245,255,0.98) 34%, rgba(237,245,255,0.92) 42%, rgba(237,245,255,0.78) 51%, rgba(237,245,255,0.58) 60%, rgba(237,245,255,0.34) 70%, rgba(237,245,255,0.14) 82%, rgba(237,245,255,0.03) 94%, transparent 100%)" }} />
        <div className="relative z-10 flex w-full items-center gap-4 px-5 py-5 sm:gap-6 sm:px-6 sm:py-6">
          <div className="max-w-[620px] min-w-0">
            <span className="inline-flex rounded-full bg-[#D6E9FF] px-3.5 py-1.5 text-sm font-semibold text-[#1264B5]">
              Você está na fila da
            </span>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#123C7D] sm:text-[30px]">
              {unidade.nome}
            </h2>
            <p className="mt-1 flex items-start text-sm leading-6 text-[#24558F] sm:text-base">
              <span>{unidade.endereco}</span>
            </p>
            {foto && atribuicao && (
              <p className="mt-1 text-[9px] text-[#496A91]">
                Foto: {atribuicao.url ? (
                  <a href={atribuicao.url} target="_blank" rel="noopener noreferrer" className="underline">{atribuicao.nome}</a>
                ) : atribuicao.nome}
              </p>
            )}
          </div>
        </div>
        {!foto && <div className="absolute right-5 top-5 hidden h-20 w-24 rounded-xl bg-[#DDEBFF]/70 sm:block" />}
      </div>
    );
  }

  return (
    <div className="w-[76px] shrink-0">
      <div className="flex h-[68px] w-[76px] items-center justify-center overflow-hidden rounded-lg bg-[#D5E5F8]">
        {foto ? (
          <img
            src={foto}
            alt={`Foto da unidade ${unidade.nome}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <svg viewBox="0 0 76 68" className="h-full w-full" aria-hidden="true">
            <rect x="0" y="49" width="76" height="19" fill="#9FB5A1" />
            <rect x="9" y="17" width="58" height="38" rx="2" fill="#F8FCFF" />
            <rect x="9" y="17" width="58" height="9" fill="#2D91AC" />
            <rect x="17" y="32" width="10" height="15" fill="#6CA6DF" />
            <rect x="33" y="32" width="10" height="15" fill="#6CA6DF" />
            <rect x="49" y="32" width="10" height="15" fill="#6CA6DF" />
          </svg>
        )}
      </div>
      {foto && atribuicao && (
        <p className="mt-1 max-w-[76px] truncate text-[8px] leading-3 text-[#60769C]" title={`Foto: ${atribuicao.nome}`}>
          Foto:{" "}
          {atribuicao.url ? (
            <a
              href={atribuicao.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {atribuicao.nome}
            </a>
          ) : (
            atribuicao.nome
          )}
        </p>
      )}
    </div>
  );
}



// ======================================================
// MARCADORES DO GOOGLE MAPS
// ======================================================

function MapaComMarcadores({ unidades, onSelecionar }) {
  const mapa = useMap();

  const [marcadores, setMarcadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroMapa, setErroMapa] = useState("");

  useEffect(() => {
    if (!mapa || !window.google?.maps) return;

    let cancelado = false;

    async function localizarUnidades() {
      setCarregando(true);
      setErroMapa("");

      try {
        const geocoder = new window.google.maps.Geocoder();

        const resultados = await Promise.all(
          unidades.map(async (unidade) => {
            try {
              const resposta = await geocoder.geocode({
                address: unidade.endereco,
                region: "BR",
              });

              const local =
                resposta.results?.[0]?.geometry?.location;

              if (!local) {
                return null;
              }

              return {
                ...unidade,
                position: {
                  lat: local.lat(),
                  lng: local.lng(),
                },
              };
            } catch {
              return null;
            }
          })
        );

        if (cancelado) return;

        const encontrados = resultados.filter(Boolean);

        setMarcadores(encontrados);

        if (encontrados.length === 0) {
          setErroMapa(
            "Não foi possível localizar as unidades. Confira os endereços e as APIs habilitadas."
          );
          return;
        }

        const limites = new window.google.maps.LatLngBounds();

        encontrados.forEach((unidade) => {
          limites.extend(unidade.position);
        });

        if (encontrados.length === 1) {
          mapa.setCenter(encontrados[0].position);
          mapa.setZoom(15);
        } else {
          mapa.fitBounds(limites, 48);
        }
      } catch (erro) {
        if (!cancelado) {
          console.error("Erro ao localizar unidades:", erro);

          setErroMapa(
            "Não foi possível carregar os endereços das unidades."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    localizarUnidades();

    return () => {
      cancelado = true;
    };
  }, [mapa, unidades]);

  return (
    <>
      {marcadores.map((unidade) => (
        <Marker
          key={unidade.id}
          position={unidade.position}
          title={unidade.nome}
          onClick={() => onSelecionar(unidade)}
        />
      ))}

      {(carregando || erroMapa) && (
        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg bg-white p-3 text-sm shadow-lg">
          {carregando ? (
            <p className="text-[#31558F]">
              Localizando unidades de saúde...
            </p>
          ) : (
            <p className="text-red-700">{erroMapa}</p>
          )}
        </div>
      )}
    </>
  );
}

// ======================================================
// MAPA REAL DO GOOGLE MAPS
// ======================================================

function MapaUnidades({ unidades, onSelecionar }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-[#D8E5F8] bg-[#F4F8FF] p-6 text-center">
        <div>
          <MapPin
            size={32}
            className="mx-auto mb-3 text-[#023E8A]"
          />

          <p className="font-semibold text-[#142F68]">
            Chave do Google Maps não encontrada
          </p>

          <p className="mt-2 text-sm text-[#60769C]">
            Confira se a variável NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            está configurada no arquivo .env.local.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl border border-[#D8E5F8]">
      <Map
          defaultCenter={{
            lat: -23.6229,
            lng: -46.5511,
          }}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          style={{
            width: "100%",
            height: "100%",
          }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <MapaComMarcadores
            unidades={unidades}
            onSelecionar={onSelecionar}
          />
      </Map>
    </div>
  );
}

// ======================================================
// PÁGINA FILA ONLINE
// ======================================================

function FilaOnlineConteudo() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);

  const [unidadeParaConfirmar, setUnidadeParaConfirmar] =
    useState(null);

  const [entrouNaFila, setEntrouNaFila] = useState(false);

  const [mostrarConfirmacaoSaida, setMostrarConfirmacaoSaida] = useState(false);

  // Modal do QR Code de check-in
  const [mostrarQr, setMostrarQr] = useState(false);

  const [ordenacao, setOrdenacao] = useState("proxima");

  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState("");

  const [especialidadeConfirmada, setEspecialidadeConfirmada] =
    useState("");

  // Estado para busca por texto
  const [busca, setBusca] = useState("");

  // Filtragem das unidades
  const unidadesFiltradas = unidades.filter((unidade) => {
    const termo = busca.toLowerCase();
    const matchNome = unidade.nome.toLowerCase().includes(termo);
    const matchEndereco = unidade.endereco.toLowerCase().includes(termo);
    const matchServico = unidade.servicos.some((s) => s.toLowerCase().includes(termo));
    return matchNome || matchEndereco || matchServico;
  });

  const unidadesOrdenadas = [...unidadesFiltradas].sort((a, b) => {
    if (ordenacao === "espera") {
      return a.espera - b.espera;
    }

    return a.id - b.id;
  });

  // Exibe no máximo LIMITE_UNIDADES na lista (a busca considera todas)
  const unidadesExibidas = unidadesOrdenadas.slice(0, LIMITE_UNIDADES);

  const unidadeAtual = unidades.find(
    (unidade) => unidade.id === unidadeSelecionada
  );

  function abrirConfirmacao(unidade) {
    setUnidadeParaConfirmar(unidade);
    setEspecialidadeSelecionada(unidade.servicos[0]);
    setEntrouNaFila(false);
  }

  function fecharModal() {
    setUnidadeParaConfirmar(null);
    setEntrouNaFila(false);
    setEspecialidadeSelecionada("");
  }

  function confirmarEntrada() {
    if (!especialidadeSelecionada || !unidadeParaConfirmar) {
      return;
    }

    setEspecialidadeConfirmada(especialidadeSelecionada);
    setEntrouNaFila(true);
  }

  function concluirConfirmacao() {
    if (entrouNaFila && unidadeParaConfirmar) {
      setUnidadeSelecionada(unidadeParaConfirmar.id);
    }

    fecharModal();
  }

  function sairDaFila() {
    setMostrarConfirmacaoSaida(true);
  }

  function confirmarSaidaDaFila() {
    setUnidadeSelecionada(null);
    setEspecialidadeConfirmada("");
    setMostrarQr(false);
    setMostrarConfirmacaoSaida(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F1F6FD] text-[#142F68]">
      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      {/* Conteúdo Principal */}
      <main className="relative z-10 mx-auto max-w-[1520px] px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        {/* TÍTULO */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#123C7D] sm:text-[40px]">
                Fila Online
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#496A91] sm:text-lg">
                Acompanhe sua posição em tempo real e tenha mais praticidade no seu atendimento.
              </p>
            </div>
          </div>
          {unidadeAtual && (
            <button
              onClick={sairDaFila}
              className="inline-flex shrink-0 items-center justify-center self-start rounded-full bg-[#14539B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0E4383] sm:self-center sm:px-8"
            >
              Sair da fila
            </button>
          )}
        </div>

        {/* POSIÇÃO NA FILA / DETALHES COMPLETOS QUANDO SELECIONADO */}

        <section className="mb-6 rounded-2xl border border-[#D9E6F8] bg-white px-4 py-4 shadow-[0_8px_25px_rgba(31,65,119,0.06)] sm:px-5 sm:py-5 lg:px-6 lg:py-5">
          {unidadeAtual ? (
            <div className="space-y-2.5">
              {/* DESTAQUE DA UNIDADE COM IMAGEM FIXA (sus.png) */}
              <UnidadeFoto unidade={unidadeAtual} destaque />

              {/* POSIÇÃO, TEMPO DE ESPERA E SENHA NO CARD AZUL */}
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.9fr_1fr]">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D5FA8] to-[#246DB5] px-4 py-6 text-white sm:px-5 sm:py-6">
                  <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-64 rotate-12 rounded-full bg-white/5" />
                  <div className="pointer-events-none absolute -bottom-24 right-0 h-52 w-64 -rotate-12 rounded-full bg-white/5" />
                  <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
                    <div className="sm:border-r sm:border-white/40 sm:pr-4">
                      <p className="text-base font-semibold text-white/95">Sua posição na fila</p>
                      <div className="mt-2 flex items-baseline justify-center gap-3 sm:justify-start">
                        <span className="text-5xl font-bold leading-none sm:text-6xl">4º</span>
                        <span className="text-base sm:text-lg">da fila</span>
                      </div>
                    </div>
                    <div className="sm:border-r sm:border-white/40 sm:px-4">
                      <p className="text-base font-semibold text-white/95">Tempo estimado de espera</p>
                      <p className="mt-2 text-center text-3xl font-bold sm:text-left">
                        {unidadeAtual.espera} min
                      </p>
                      <p className="mt-1 text-center text-xs text-white/90 sm:text-left">
                        Sujeito à triagem médica
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center sm:pl-4">
                      <p className="text-base font-semibold text-white/95">Sua senha</p>
                      <span className="mt-2 rounded-lg bg-white/15 px-4 py-1 text-3xl font-bold tracking-wide text-white ring-1 ring-inset ring-white/25">
                        A-084
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[#D6E7FF] overflow-hidden rounded-2xl border border-[#D6E7FF] bg-[#F5F9FF] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  {/* ESPECIALIDADE */}
                  <div className="flex items-center justify-center px-4 py-3 text-center sm:px-5 sm:py-3.5">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#32629C]">Especialidade</p>
                      <p className="mt-1 text-xl font-bold leading-tight text-[#123C7D] sm:text-2xl">
                        {especialidadeConfirmada}
                      </p>
                      <span className="mt-3 inline-flex rounded-full bg-[#D9EBFF] px-3 py-1.5 text-xs font-semibold text-[#1264B5]">
                        Atendimento presencial
                      </span>
                    </div>
                  </div>

                  {/* QR CODE DE CHECK-IN (clique para gerar) */}
                  <button
                    type="button"
                    onClick={() => setMostrarQr(true)}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-3 text-center transition hover:bg-[#E8F1FF] sm:px-5 sm:py-3.5"
                  >
                    <QrCode size={40} strokeWidth={1.6} className="text-[#14539B]" />
                    <p className="text-base font-semibold text-[#32629C]">Check-in</p>
                    <span className="text-sm font-semibold leading-snug text-[#14539B]">
                      Clique para gerar o QR Code de check-in
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VISÃO PADRÃO (SEM FILA) */
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="flex min-w-0 items-center gap-5 sm:gap-7">
                <div className="relative flex h-[108px] w-[108px] shrink-0 items-center justify-center rounded-full bg-[#DFEAFC] sm:h-[118px] sm:w-[118px]">
                  <UserRound
                    size={60}
                    strokeWidth={1.6}
                    className="text-[#023E8A]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-sm font-medium text-[#304A7D]">
                    Sua posição na fila
                  </p>

                  <h2 className="text-2xl font-bold text-[#142F68] tracking-tight sm:text-[32px]">
                    Escolha uma unidade
                  </h2>

                  <p className="mt-1 text-base text-[#304A7D]">
                    Veja as opções disponíveis na sua região
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-[#DCE7F7] rounded-xl bg-[#F0F5FD] px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-4 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
                <div className="flex items-center gap-4 py-4 sm:pr-3 lg:py-3">
                  <Clock size={32} className="shrink-0 text-[#023E8A]" />
                  <div>
                    <p className="text-sm text-[#304A7D]">Tempo estimado</p>
                    <p className="text-3xl font-bold text-[#142F68] leading-tight">—</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-4 sm:pl-4 lg:py-3 lg:pl-0">
                  <UsersRound size={32} className="shrink-0 text-[#023E8A]" />
                  <div>
                    <p className="text-sm text-[#304A7D]">Sua posição</p>
                    <p className="text-xl font-bold text-[#142F68] leading-tight">Não está na fila</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* LISTA DE UNIDADES E MAPA */}

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.65fr_1fr]">
          <section className="min-w-0 rounded-2xl border border-[#D9E6F8] bg-white p-5 shadow-[0_8px_25px_rgba(31,65,119,0.05)] sm:p-7">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#E5EDF9] pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-3 text-lg font-bold text-[#142F68] sm:text-xl">
                  Unidades de saúde mais próximas
                </h2>
              </div>

              {/* BARRA DE PESQUISA */}
              <div className="relative mt-1 w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#304A7D]" />
                <input
                  type="text"
                  placeholder="Pesquisar UPA, UBS, bairro ou especialidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-xl border border-[#D4E1F5] bg-[#F8FAFE] pl-10 pr-4 py-2.5 text-sm font-medium text-[#142F68] placeholder-[#60769C] focus:border-[#023E8A] focus:bg-white focus:outline-none transition"
                />
                {busca && (
                  <button
                    onClick={() => setBusca("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#304A7D] hover:text-[#023E8A]"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-[#E4ECF9]">
              {unidadesExibidas.length > 0 ? (
                unidadesExibidas.map((unidade) => {
                  const selecionada =
                    unidade.id === unidadeSelecionada;

                  return (
                    <article
                      key={unidade.id}
                      className={`flex flex-col gap-4 py-5 first:pt-1 last:pb-1 sm:flex-row sm:items-center ${
                        selecionada
                          ? "rounded-xl bg-[#F7FAFF] px-3"
                          : ""
                      }`}
                    >
                      <UnidadeFoto unidade={unidade} />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#142F68]">
                          {unidade.nome}
                        </h3>

                        {/* ENDEREÇO */}
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#304A7D] sm:text-sm">
                          <MapPin size={14} className="shrink-0 text-[#023E8A]" />
                          <span className="truncate">{unidade.endereco}</span>
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {unidade.servicos.map((servico) => (
                            <span
                              key={servico}
                              className="rounded-full bg-[#EAF1FD] px-2.5 py-1 text-[10px] font-medium text-[#2855A0] sm:text-[11px]"
                            >
                              {servico}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-center sm:gap-1">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-[11px] text-[#304A7D]">
                              Tempo de espera
                            </p>

                            <p
                              className={`text-xl font-bold leading-tight ${
                                unidade.tipo === "rapida"
                                  ? "text-[#17418E]"
                                  : "text-[#17418E]"
                              }`}
                            >
                              {unidade.espera} min
                            </p>

                            <span
                              className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-medium ${
                                unidade.tipo === "rapida"
                                  ? "bg-green-100 text-[#17418E]"
                                  : "bg-[#E8F0FD] text-[#17418E]"
                              }`}
                            >
                              Fila{" "}
                              {unidade.tipo === "rapida"
                                ? "rápida"
                                : "normal"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => abrirConfirmacao(unidade)}
                        className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors sm:min-w-[116px] ${
                          selecionada
                            ? "border border-[#023E8A] bg-white text-[#023E8A] hover:bg-blue-50"
                            : "bg-[#023E8A] text-white hover:bg-[#002B66]"
                        }`}
                      >
                        {selecionada ? "Selecionada" : "Selecionar"}

                        {!selecionada && <ArrowRight size={16} />}
                      </button>
                    </article>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold text-[#304A7D]">
                    Nenhuma unidade encontrada para a sua busca.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* MAPA REAL */}

          <section className="flex flex-col rounded-2xl border border-[#D9E6F8] bg-white p-5 shadow-[0_8px_25px_rgba(31,65,119,0.05)] sm:p-6">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-[#142F68]">
              <MapPin size={22} className="text-[#023E8A]" />

              Unidades no seu bairro
            </h2>

            <div className="relative min-h-[320px] flex-1">
              <MapaUnidades
                unidades={unidades}
                onSelecionar={abrirConfirmacao}
              />
            </div>
          </section>
        </div>
      </main>

      {/* NOTIFICAÇÃO PERSONALIZADA PARA SAIR DA FILA */}
      {mostrarConfirmacaoSaida && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071638]/55 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setMostrarConfirmacaoSaida(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-sair-fila"
            aria-describedby="descricao-sair-fila"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D9E6F8] bg-white shadow-2xl"
          >
            <div className="flex items-start gap-4 p-6 sm:p-7">
              <div className="min-w-0 flex-1">
                <h2 id="titulo-sair-fila" className="text-xl font-bold text-[#142F68]">
                  Deseja sair da fila?
                </h2>
                <p id="descricao-sair-fila" className="mt-2 text-sm leading-6 text-[#526987]">
                  Se você sair agora, sua posição atual será encerrada. Para acompanhar o atendimento novamente, será necessário entrar na fila outra vez.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarConfirmacaoSaida(false)}
                aria-label="Fechar confirmação"
                className="-mr-2 -mt-2 rounded-lg p-2 text-[#7183A0] transition hover:bg-[#F1F6FD] hover:text-[#142F68]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-[#E6EDF7] bg-[#F8FAFE] p-5 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={() => setMostrarConfirmacaoSaida(false)}
                className="rounded-xl border border-[#C9D7EA] bg-white px-5 py-3 text-sm font-semibold text-[#24466F] transition hover:bg-[#EDF4FD]"
              >
                Continuar na fila
              </button>
              <button
                type="button"
                onClick={confirmarSaidaDaFila}
                className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002B66] focus:outline-none focus:ring-4 focus:ring-[#023E8A]/20"
              >
                Sim, sair da fila
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}

      {unidadeParaConfirmar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#071638]/55 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmacao"
            className={`my-auto w-full ${
              entrouNaFila
                ? "max-w-[480px] p-6 sm:p-7"
                : "max-w-xl p-7 sm:p-9"
            } rounded-2xl bg-white shadow-2xl`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#023E8A]">
                  Fila Online
                </span>

                <h2
                  id="titulo-confirmacao"
                  className="mt-3 text-2xl font-bold text-[#142F68]"
                >
                  {entrouNaFila
                    ? ""
                    : "Deseja entrar nesta fila?"}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fechar janela"
              >
                <X size={22} />
              </button>
            </div>

            {entrouNaFila ? (
              <div>
                <div className="text-center">
                  

                  <h2
                    id="titulo-confirmacao"
                    className="text-2xl font-bold tracking-tight text-[#142F68]"
                  >
                    Você entrou na fila!
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#60769C]">
                    Sua presença foi confirmada na unidade{" "}
                    <strong className="text-[#142F68]">
                      {unidadeParaConfirmar.nome}
                    </strong>{" "}
                    para atendimento.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#D5E5FF] bg-[#F1F6FF]">
                  <div className="flex flex-col items-center justify-center border-r border-[#D5E5FF] px-3 py-5 text-center">
                    <UserRound size={27} className="mb-2 text-[#1752B5]" />

                    <p className="text-sm text-[#60769C]">Sua senha</p>

                    <span className="mt-2 rounded-xl bg-[#DFEAFF] px-4 py-2 text-3xl font-bold tracking-wide text-[#1752B5]">
                      A-084
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center px-3 py-5 text-center">
                    <MapPin size={27} className="mb-2 text-[#1752B5]" />

                    <p className="text-sm text-[#60769C]">Unidade</p>

                    <p className="mt-2 font-bold text-[#142F68]">
                      {unidadeParaConfirmar.nome}
                    </p>

                    <p className="mt-1 text-sm text-[#60769C]">
                      {especialidadeSelecionada}
                    </p>
                  </div>
                </div>

                <div className="my-5 flex items-center justify-center gap-2 text-center text-sm text-[#60769C]">
                  <Clock size={19} className="shrink-0" />
                  <span>Aguarde o chamado no painel da unidade.</span>
                </div>

                <button
                  type="button"
                  onClick={concluirConfirmacao}
                  className="w-full rounded-xl bg-[#1949A5] px-5 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-[#123B89]"
                >
                  Acompanhar Fila
                </button>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm leading-6 text-[#304A7D]">
                  Confira os dados da unidade e escolha o tipo de
                  atendimento antes de solicitar sua entrada na fila.
                </p>

                <div className="rounded-xl border border-[#D9E6F8] bg-[#F4F8FF] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DFEAFC] text-[#023E8A]">
                      <MapPin size={25} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#142F68]">
                        {unidadeParaConfirmar.nome}
                      </h3>

                      <p className="mt-1 text-sm text-[#304A7D]">
                        Unidade de saúde
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-sm leading-5 text-[#304A7D]">
                    <Navigation
                      size={17}
                      className="mt-0.5 shrink-0 text-[#023E8A]"
                    />

                    <span>{unidadeParaConfirmar.endereco}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-[#304A7D]">
                        Endereço da Unidade
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#142F68] line-clamp-2">
                        {unidadeParaConfirmar.endereco}
                      </p>
                    </div>

                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-[#304A7D]">
                        Espera estimada
                      </p>

                      <p className="mt-1 font-bold text-[#142F68]">
                        {unidadeParaConfirmar.espera} minutos
                      </p>
                    </div>
                  </div>

                  {/* ESPECIALIDADES */}

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold text-[#304A7D]">
                      ESCOLHA O TIPO DE ATENDIMENTO
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {unidadeParaConfirmar.servicos.map(
                        (servico) => {
                          const selecionado =
                            especialidadeSelecionada === servico;

                          return (
                            <button
                              key={servico}
                              type="button"
                              onClick={() =>
                                setEspecialidadeSelecionada(servico)
                              }
                              aria-pressed={selecionado}
                              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                selecionado
                                  ? "border-[#023E8A] bg-[#023E8A] text-white shadow-sm"
                                  : "border-transparent bg-[#E3EDFC] text-[#214A96] hover:border-[#9CB8E8]"
                              }`}
                            >
                              {servico}

                              {selecionado && (
                                <span className="ml-1.5">✓</span>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>

                    
                  </div>
                </div>

                

                {/* CONFIRMAÇÃO */}

                <p className="mt-4 text-sm font-medium leading-6 text-[#142F68]">
                  Deseja solicitar sua entrada na fila de{" "}
                  <strong>{especialidadeSelecionada}</strong> da
                  unidade <strong>{unidadeParaConfirmar.nome}</strong>?
                </p>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="flex-1 rounded-xl border border-[#C9D8EF] px-4 py-3 font-semibold text-[#023E8A] transition-colors hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={confirmarEntrada}
                    disabled={!especialidadeSelecionada}
                    className="flex-1 rounded-xl bg-[#023E8A] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#002B66] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirmar entrada
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL DO QR CODE DE CHECK-IN */}

      {mostrarQr && unidadeAtual && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-[#071638]/55 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMostrarQr(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#023E8A]">
                Check-in
              </span>
              <button
                type="button"
                onClick={() => setMostrarQr(false)}
                aria-label="Fechar"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <h2 className="mt-3 text-xl font-bold text-[#142F68]">Seu QR Code</h2>
            <p className="mt-1 text-sm text-[#60769C]">
              Apresente na recepção de {unidadeAtual.nome}
            </p>

            <div className="mx-auto mt-5 w-fit rounded-2xl border border-[#D5E5FF] bg-white p-4">
              <QRCodeSVG
                value={`fila-online|unidade:${unidadeAtual.id}|senha:A-084`}
                size={200}
                level="M"
              />
            </div>

            <p className="mt-4 text-sm text-[#60769C]">Sua senha</p>
            <span className="mt-1 inline-block rounded-xl bg-[#DFEAFF] px-4 py-1.5 text-2xl font-bold tracking-wide text-[#1752B5]">
              A-084
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilaOnlinePage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <FilaOnlineConteudo />;
  }

  return (
    <APIProvider apiKey={apiKey} language="pt-BR" region="BR">
      <FilaOnlineConteudo />
    </APIProvider>
  );
}