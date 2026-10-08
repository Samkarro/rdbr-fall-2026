import { Archivo } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import KinoHeader from "@/lib/components/global/header";
import KinoFooter from "@/lib/components/global/footer";
import { getFilterOptions } from "@/lib/api/catalog.api";
import { getMe } from "@/lib/api/user.api";

export const metadata: Metadata = {
  title: "Kino XII",
  description: "Solution by Luka Gogichaishvili",
};

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const options = await getFilterOptions();
  const user = await getMe();

  return (
    <html lang="en" className={archivo.className}>
      <body>
        <KinoHeader user={user}></KinoHeader>
        {children}
        <KinoFooter></KinoFooter>
      </body>
    </html>
  );
}
