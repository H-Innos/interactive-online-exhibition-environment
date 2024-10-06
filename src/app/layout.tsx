import "~/styles/globals.css";
import Header from "~/app/_components/header"; // Adjust the path if needed
import Footer from "~/app/_components/footer"; // Adjust the path if needed

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "UTLib Näitused",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Header /> {/* Header should be here */}
          <main>{children}</main>
          <Footer /> {/* Footer should be here */}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
