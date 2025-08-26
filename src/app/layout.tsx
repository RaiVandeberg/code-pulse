import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/clerk.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations"
import { ClientProviders } from "@/components/shared/client-providers";
import { setDefaultOptions } from "date-fns";
import { ptBR as dateFnsPtBR } from "date-fns/locale";

setDefaultOptions({ locale: dateFnsPtBR });

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Code Pulse",
    default: "Code Pulse"
  },
  icons: {
    icon: "/favicon.svg"
  }

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
          <ClientProviders>
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
