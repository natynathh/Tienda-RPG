import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La tienda de los mundos | El mundo jugando al mismo tiempo",
  description: "Una experiencia interactiva tipo RPG: habla con Lira y descubre los videojuegos como mundos habitados a través de datos, reliquias e historias.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
