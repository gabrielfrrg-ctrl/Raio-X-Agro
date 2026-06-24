import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raio X Agro — Diagnóstico Financeiro",
  description: "Diagnóstico financeiro gratuito para o agronegócio.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Raio X Agro — Diagnóstico Financeiro para o Agronegócio",
    description: "Diagnóstico financeiro gratuito para o agronegócio. Sem conflito de interesse. Sem compromisso.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
