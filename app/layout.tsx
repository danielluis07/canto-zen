import type { Metadata } from "next";
import "./globals.css";
import { schibstedGrotesk, zenOldMincho } from "@/fonts";

export const metadata: Metadata = {
  title: "Canto Zen",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${zenOldMincho.variable} ${schibstedGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
