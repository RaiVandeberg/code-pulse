import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/clerk.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations"

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codelab",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(160 100% 37%)", // Indigo 600
        },
      }}
      localization={ptBR}>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={cn(nunito.variable, "antialiased font-sans dark")}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
