import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Balance Calistenia",
  description: "Planificaciones y membresías de calistenia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-950 text-white">
        <div className="noise min-h-screen">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
