import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "~/lib/session";

const PROTECTED_ROUTE = "/dashboard";
const ROOT = "/";
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(PROTECTED_ROUTE);

  const session = await getSession();

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL(ROOT, req.nextUrl));
  }

  return NextResponse.next();
}
