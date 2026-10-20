import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/header/page.jsx";
import Footer from "./components/footer/page.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ConectaSUS",
  description: "Sistema digital para facilitar o atendimento no SUS",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white">

        {/* HEADER DO SITE */}
        <Header />

        {/* 
          AQUI ENTRA A PÁGINA ATUAL

          /                     -> src/app/page.jsx
          /publico/unidades     -> src/app/publico/unidades/page.jsx
          /cliente/exames       -> src/app/cliente/exames/page.jsx
          /admin/gestaoexame    -> src/app/admin/gestaoexame/page.jsx
        */}
        <main>
          {children}
        </main>

        {/* FOOTER DO SITE */}
        <Footer />

      </body>
    </html>
  );
}