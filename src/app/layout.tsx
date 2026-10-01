import { Archivo } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import KinoHeader from "@/lib/components/header";

export const metadata: Metadata = {
  title: "Kino XII",
  description: "Solution by Luka Gogichaishvili",
};

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.className}>
      <body>
        <KinoHeader></KinoHeader>
        TEST{children}
      </body>
    </html>
  );
}
