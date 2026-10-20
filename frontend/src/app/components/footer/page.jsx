import { Phone, Mail } from "lucide-react";

function SocialIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 23,
    height: 23,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
        <path d="M3 9h4v12H3z" />
        <path d="M11 9h4v2a4 4 0 0 1 7 3v7h-4v-6a2 2 0 0 0-4 0v6h-4z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h3l.5-4h-3.5V7c0-1.2.4-2 2-2H17V1.4A20 20 0 0 0 14.5 1C11 1 9 3.1 9 6.8V9H6v4h3v8z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#0B1756] text-white">
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -left-28 bottom-[-150px] h-72 w-72 rounded-full border border-[#173C87]/50 bg-[#173C87]/10" />

      <div className="pointer-events-none absolute -right-24 top-8 flex h-72 w-72 items-center justify-center rounded-[70px] bg-[#173C87]/10">
        <div className="h-48 w-48 rounded-full border-2 border-[#173C87]/70" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 py-10 md:px-12 lg:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          {/* Logo e apresentação */}
          <div className="flex flex-col items-start">
            <img
              src="/logo-uneSUS.png"
              alt="UneSUS"
              className="mb-4 w-full max-w-[320px] object-contain object-left"
            />

            <p className="mt-3 max-w-md text-sm leading-6 text-blue-100 md:text-base">
              Tecnologia e integração para um sistema de saúde
              mais acessível, eficiente e humano.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h2 className="mb-5 text-xl font-bold text-white">
              Contato
            </h2>

            <div className="space-y-3">
              <a
                href="tel:+5519994632008"
                className="group flex items-center gap-3 text-sm text-blue-50 transition-colors hover:text-[#173C87] md:text-base"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173C87] text-white transition-transform group-hover:scale-110">
                  <Phone size={18} />
                </span>
                <span>(19) 99463-2008</span>
              </a>

              <a
                href="mailto:unesus@email.com.br"
                className="group flex items-center gap-3 text-sm text-blue-50 transition-colors hover:text-[#173C87] md:text-base"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173C87] text-white transition-transform group-hover:scale-110">
                  <Mail size={18} />
                </span>
                <span className="break-all">unesus@email.com.br</span>
              </a>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="border-t border-[#173C87]/50 pt-6 md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 className="mb-5 text-xl font-bold text-white">
              Siga-nos nas redes
            </h2>

            <div className="mb-5 flex flex-wrap gap-3">
              {[
                { name: "linkedin", label: "LinkedIn" },
                { name: "instagram", label: "Instagram" },
                { name: "facebook", label: "Facebook" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#173C87] text-blue-100 transition-all hover:bg-[#173C87] hover:text-white"
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>

            <p className="max-w-xs text-sm leading-6 text-blue-100 md:text-base">
              Acompanhe novidades, projetos e tudo sobre o UneSUS.
            </p>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-8 border-t border-[#173C87] pt-5">
          <p className="text-center text-xs leading-5 text-blue-100 md:text-sm">
            © {new Date().getFullYear()} – UneSUS – Sistema de
            Gestão para Saúde Pública Municipal
          </p>
        </div>
      </div>
    </footer>
  );
}