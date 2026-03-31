import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Creative Generator",
  description: "Génère des créas publicitaires à partir de tes images produit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
