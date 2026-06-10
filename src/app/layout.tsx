import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import ReduxProvider from "@/store/ReduxProvider";
import Toast from "@/components/toast/toast";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skypro Music",
  description: "Музыкальный стриминговый сервис Skypro Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body>
        <ReduxProvider>
          {children}
          <Toast />
        </ReduxProvider>
      </body>
    </html>
  );
}
