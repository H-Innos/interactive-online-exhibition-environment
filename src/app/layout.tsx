import "~/styles/globals.css";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { getSession } from "~/lib/session";
import { SessionProvider } from "~/lib/contexts/SessionProvider";

export const metadata: Metadata = {
  title: "UTLib Näitused",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-white">
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Header />
            <div className="relative">
              <main>{children}</main>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-gray-100"></div>
            </div>
            <Footer />
            <Toaster />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
