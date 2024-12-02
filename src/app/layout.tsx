import "~/styles/globals.css";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "UTLib näitused",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
