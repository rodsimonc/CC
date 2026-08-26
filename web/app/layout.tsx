import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Estudio Moix Abogados — Derecho penal en Mar del Plata",
    template: "%s · Moix Abogados",
  },
  description:
    "Defensa penal en Mar del Plata. Consultá con nuestro asistente virtual: te decimos si tu caso es para nosotros o te orientamos hacia el fuero correcto.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Estudio Moix Abogados",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
