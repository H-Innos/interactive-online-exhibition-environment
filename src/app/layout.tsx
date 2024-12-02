import "~/styles/globals.css";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UTLib näitused",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Header />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
