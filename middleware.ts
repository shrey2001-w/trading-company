import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME = "session_token";

const PROTECTED_PREFIXES = ["/painter", "/buyer", "/checkout", "/admin"];
const PAINTER_ONLY_PREFIXES = ["/painter"];
const BUYER_ONLY_PREFIXES = ["/buyer", "/checkout"];
const ADMIN_ONLY_PREFIXES = ["/admin"];
const AUTH_PAGES = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

type SessionPayload = { id: string; role: "painter" | "buyer" | "admin"; name: string };

async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

function homeForRole(role: SessionPayload["role"]) {
  if (role === "admin") return "/admin";
  if (role === "painter") return "/painter";
  return "/";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSessionFromRequest(req);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPainterOnly = PAINTER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  const isBuyerOnly = BUYER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(homeForRole(session.role), req.url));
  }

  if (isProtected && !session) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (session && isPainterOnly && session.role !== "painter") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (session && isBuyerOnly && session.role !== "buyer") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (session && isAdminOnly && session.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};