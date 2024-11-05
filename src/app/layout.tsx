import "~/styles/globals.css";
import Header from "~/app/_components/header"; 
import Footer from "~/app/_components/footer";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "UTLib näitused",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Header />

        <TRPCReactProvider>
            <main>{children}</main>
        </TRPCReactProvider>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
