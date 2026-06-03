import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperAdmin",
  description: "Panel de administracion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
