import { type NextRequest, NextResponse } from "next/server";
import { decrypt, getSession } from "~/lib/session";

const PROTECTED_ROUTE = "/dashboard";
const ROOT = "/";
export default async function middleware(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.POSTGRES_URL?.includes("local-db")
  ) {
    // stupid way to get pipeline tests to work correctly
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(PROTECTED_ROUTE);

  // const session = await getSession();

  const cookie = req.cookies.get("session")?.value;

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL(ROOT, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
