"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

type SessionUser = { id: string; role: "painter" | "buyer"; name: string };

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const { totalItems, toggleCart } = useCart();
  const router = useRouter();
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setIsSignInOpen(false);
      }
      if (signUpRef.current && !signUpRef.current.contains(e.target as Node)) {
        setIsSignUpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#FAF8F5]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAF8F5]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setIsMenuOpen(false)}
        >
          <PaintDropMark className="h-8 w-8" />
          <span className="font-brand text-xl font-semibold tracking-tight text-[#1C1B1F]">
            Hue&nbsp;&amp;&nbsp;Co.
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-[#4A4540] transition-colors hover:text-[#2F4B8C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <CartButton totalItems={totalItems} onClick={toggleCart} />

          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <>
                {user.role === "buyer" && (
                  <Link
                    href="/profile"
                    className="rounded-md px-4 py-2 text-[15px] font-medium text-[#1C1B1F] transition-colors hover:bg-stone-200/60"
                  >
                    Hi, {user.name.split(" ")[0]}
                  </Link>
                )}
                {user.role !== "buyer" && (
                  <span className="text-[15px] font-medium text-[#1C1B1F]">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="rounded-md px-4 py-2 text-[15px] font-medium text-[#1C1B1F] transition-colors hover:bg-stone-200/60"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Sign In dropdown */}
                <div className="relative" ref={signInRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignInOpen((open) => !open);
                      setIsSignUpOpen(false);
                    }}
                    aria-expanded={isSignInOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1 rounded-md px-4 py-2 text-[15px] font-medium text-[#1C1B1F] transition-colors hover:bg-stone-200/60"
                  >
                    Sign In
                    <svg
                      className={`h-4 w-4 transition-transform ${isSignInOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isSignInOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-stone-200 bg-white py-2 shadow-lg">
                      <Link
                        href="/sign-in/painter"
                        onClick={() => setIsSignInOpen(false)}
                        className="block px-4 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-100"
                      >
                        Sign in as Painter
                      </Link>
                      <Link
                        href="/sign-in/buyer"
                        onClick={() => setIsSignInOpen(false)}
                        className="block px-4 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-100"
                      >
                        Sign in as Buyer
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sign Up dropdown */}
                <div className="relative" ref={signUpRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpOpen((open) => !open);
                      setIsSignInOpen(false);
                    }}
                    aria-expanded={isSignUpOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1 rounded-md bg-[#E85D3D] px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-[#D14F31]"
                  >
                    Sign Up
                    <svg
                      className={`h-4 w-4 transition-transform ${isSignUpOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isSignUpOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-stone-200 bg-white py-2 shadow-lg">
                      <Link
                        href="/sign-up/painter"
                        onClick={() => setIsSignUpOpen(false)}
                        className="block px-4 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-100"
                      >
                        Sign up as Painter
                      </Link>
                      <Link
                        href="/sign-up/buyer"
                        onClick={() => setIsSignUpOpen(false)}
                        className="block px-4 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-100"
                      >
                        Sign up as Customer
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#1C1B1F] md:hidden"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-stone-200 bg-[#FAF8F5] transition-[max-height] duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-[36rem]" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#4A4540] hover:bg-stone-200/60 hover:text-[#2F4B8C]"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 flex flex-col gap-2 border-t border-stone-200 pt-3">
            {user ? (
              <>
                {user.role === "buyer" && (
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-200/60"
                  >
                    My Profile
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="rounded-md px-3 py-2.5 text-center text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-200/60"
                >
                  Sign Out ({user.name.split(" ")[0]})
                </button>
              </>
            ) : (
              <>
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[#8a8378]">
                  Sign In
                </p>
                <Link
                  href="/sign-in/painter"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-200/60"
                >
                  Sign in as Painter
                </Link>
                <Link
                  href="/sign-in/buyer"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-200/60"
                >
                  Sign in as Buyer
                </Link>

                <p className="mt-2 px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-[#8a8378]">
                  Sign Up
                </p>
                <Link
                  href="/sign-up/painter"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[15px] font-medium text-[#1C1B1F] hover:bg-stone-200/60"
                >
                  Sign up as Painter
                </Link>
                <Link
                  href="/sign-up/buyer"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md bg-[#E85D3D] px-3 py-2.5 text-center text-[15px] font-semibold text-white hover:bg-[#D14F31]"
                >
                  Sign up as Customer
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      <CartDrawer />
    </header>
  );
}

function CartButton({ totalItems, onClick }: { totalItems: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open cart, ${totalItems} items`}
      className="relative inline-flex items-center justify-center rounded-md p-2 text-[#1C1B1F] transition-colors hover:bg-stone-200/60"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.163.075-.3-.148-.594-.458-.594H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#E85D3D] px-1 text-[11px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

function PaintDropMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3c4.5 5.2 8.5 10.4 8.5 15A8.5 8.5 0 1 1 7.5 18c0-4.6 4-9.8 8.5-15Z" fill="#2F4B8C" />
      <path
        d="M16 3c4.5 5.2 8.5 10.4 8.5 15 0 1.2-.2 2.4-.6 3.4C21 15.8 18.2 10.6 13.4 6.9 14.2 5.9 15.1 4.9 16 3Z"
        fill="#E85D3D"
      />
    </svg>
  );
}