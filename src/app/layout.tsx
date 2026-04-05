import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";

export const metadata: Metadata = {
  title: { default: "Balance Calistenia", template: "%s — Balance Calistenia" },
  description: "Planificación mensual de calistenia con seguimiento personalizado. Fuerza, skills y progresión real.",
  openGraph: {
    title: "Balance Calistenia",
    description: "Planificación mensual de calistenia con seguimiento personalizado.",
    siteName: "Balance Calistenia",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-950 text-white">
        <div className="noise min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}
